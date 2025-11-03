require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const http = require('http');
const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const fileRoutes = require('./routes/files');
const groupRoutes = require('./routes/groups');
const statusRoutes = require('./routes/status');
const callRoutes = require('./routes/calls');

// Import database (singleton) - auto-detect SQLite or PostgreSQL
const db = process.env.DATABASE_URL 
  ? require('./database-postgres')
  : require('./database');

// Create data directory if not exists
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Initialize Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://192.168.1.2:3000', 'http://192.168.1.2:5173', /^http:\/\/192\.168\./],
    credentials: true,
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://192.168.1.2:3000', 'http://192.168.1.2:5173', /^http:\/\/192\.168\./],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

// Make io accessible to routes
app.io = io;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes - Will be initialized after database is ready
let routesInitialized = false;

function initializeRoutes() {
  if (!routesInitialized) {
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/files', fileRoutes);
    app.use('/api/groups', groupRoutes);
    app.use('/api/status', statusRoutes);
    app.use('/api/calls', callRoutes);
    routesInitialized = true;
    console.log('✅ API routes initialized');
  }
}

// Socket.IO connection handling
const connectedUsers = new Map(); // userId -> socketId mapping
const userHeartbeats = new Map(); // userId -> timestamp

// Heartbeat monitoring - check every 30 seconds
setInterval(() => {
  const now = Date.now();
  const timeout = 60000; // 60 seconds timeout
  
  for (const [userId, timestamp] of userHeartbeats.entries()) {
    if (now - timestamp > timeout) {
      console.log(`⚠️ User ${userId} heartbeat timeout - marking as offline`);
      connectedUsers.delete(userId);
      userHeartbeats.delete(userId);
      io.emit('user:offline', { userId });
    }
  }
}, 30000);

io.on('connection', (socket) => {
  console.log(`🔌 New socket connection: ${socket.id}`);

  // Heartbeat handler
  socket.on('heartbeat', () => {
    if (socket.userId) {
      userHeartbeats.set(socket.userId, Date.now());
    }
  });

  // Authenticate socket connection
  socket.on('authenticate', (token) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'private_server_secret_key');
      socket.userId = decoded.id;
      connectedUsers.set(decoded.id, socket.id);
      userHeartbeats.set(decoded.id, Date.now());
      
      // Join user's personal room
      socket.join(`user:${decoded.id}`);
      
      // Join all user's groups
      const userGroups = db.getUserGroups(decoded.id);
      userGroups.forEach(group => {
        socket.join(`group:${group.id}`);
      });

      // Send undelivered messages (offline message queue)
      const undeliveredMessages = db.getUndeliveredMessages(decoded.id);
      if (undeliveredMessages.length > 0) {
        console.log(`📬 Sending ${undeliveredMessages.length} undelivered messages to user ${decoded.id}`);
        socket.emit('messages:offline_queue', undeliveredMessages);
        
        // Mark messages as delivered
        undeliveredMessages.forEach(msg => {
          db.markMessageAsDelivered(msg.id);
        });
      }

      socket.emit('authenticated', { 
        userId: decoded.id,
        offlineMessages: undeliveredMessages.length 
      });
      console.log(`✅ User ${decoded.id} authenticated on socket ${socket.id}`);
      
      // Notify others that user is online
      io.emit('user:online', { userId: decoded.id });
    } catch (error) {
      console.error('❌ Authentication error:', error.message);
      socket.emit('authentication_error', { message: 'Invalid token' });
    }
  });

  // Typing indicator
  socket.on('typing:start', (data) => {
    if (data.receiverId) {
      io.to(`user:${data.receiverId}`).emit('typing:start', {
        userId: socket.userId,
        receiverId: data.receiverId
      });
    } else if (data.groupId) {
      socket.to(`group:${data.groupId}`).emit('typing:start', {
        userId: socket.userId,
        groupId: data.groupId
      });
    }
  });

  socket.on('typing:stop', (data) => {
    if (data.receiverId) {
      io.to(`user:${data.receiverId}`).emit('typing:stop', {
        userId: socket.userId,
        receiverId: data.receiverId
      });
    } else if (data.groupId) {
      socket.to(`group:${data.groupId}`).emit('typing:stop', {
        userId: socket.userId,
        groupId: data.groupId
      });
    }
  });

  // WebRTC signaling for voice/video calls
  socket.on('call:offer', (data) => {
    const { receiverId, groupId, offer, callType } = data;
    if (receiverId) {
      io.to(`user:${receiverId}`).emit('call:offer', {
        callerId: socket.userId,
        offer,
        callType
      });
    } else if (groupId) {
      socket.to(`group:${groupId}`).emit('call:offer', {
        callerId: socket.userId,
        offer,
        callType
      });
    }
  });

  socket.on('call:answer', (data) => {
    const { callerId, answer } = data;
    io.to(`user:${callerId}`).emit('call:answer', {
      receiverId: socket.userId,
      answer
    });
  });

  socket.on('call:ice-candidate', (data) => {
    const { targetId, candidate } = data;
    io.to(`user:${targetId}`).emit('call:ice-candidate', {
      userId: socket.userId,
      candidate
    });
  });

  socket.on('call:reject', (data) => {
    const { callerId } = data;
    io.to(`user:${callerId}`).emit('call:rejected', {
      receiverId: socket.userId
    });
  });

  socket.on('call:end', (data) => {
    const { targetId, groupId } = data;
    if (targetId) {
      io.to(`user:${targetId}`).emit('call:ended', {
        userId: socket.userId
      });
    } else if (groupId) {
      socket.to(`group:${groupId}`).emit('call:ended', {
        userId: socket.userId
      });
    }
  });

  // Join group room
  socket.on('group:join', (groupId) => {
    socket.join(`group:${groupId}`);
    console.log(`User ${socket.userId} joined group ${groupId}`);
  });

  // Leave group room
  socket.on('group:leave', (groupId) => {
    socket.leave(`group:${groupId}`);
    console.log(`User ${socket.userId} left group ${groupId}`);
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    if (socket.userId) {
      connectedUsers.delete(socket.userId);
      userHeartbeats.delete(socket.userId);
      io.emit('user:offline', { userId: socket.userId });
    }
  });

  // Error handler
  socket.on('error', (error) => {
    console.error(`❌ Socket error for ${socket.id}:`, error.message);
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🔐 AdilPrivateServer - Server Privato con Real-Time',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: db.isConnected() ? 'connected' : 'disconnected',
    websocket: 'active',
    connectedUsers: connectedUsers.size,
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      messages: '/api/messages',
      files: '/api/files',
      groups: '/api/groups',
      status: '/api/status',
      calls: '/api/calls',
      health: '/health'
    },
    features: [
      '✅ Real-time messaging',
      '✅ Group chats',
      '✅ Voice messages',
      '✅ Video messages',
      '✅ File sharing',
      '✅ Status/Stories',
      '✅ Voice/Video calls',
      '✅ Typing indicators',
      '✅ Read receipts',
      '✅ Delivery receipts'
    ],
    note: 'Dashboard disponibile su http://localhost:3000'
  });
});

// Health check
app.get('/health', (req, res) => {
  const dbHealthy = db.isConnected() && db.healthCheck();
  res.json({ 
    status: dbHealthy ? 'OK' : 'DEGRADED', 
    timestamp: new Date().toISOString(),
    database: dbHealthy ? 'connected' : 'disconnected',
    websocket: io ? 'active' : 'inactive',
    connectedUsers: connectedUsers.size
  });
});

// Initialize database on startup
db.init().then(() => {
  console.log('✅ Database inizializzato con successo');
  console.log('🗄️  Database locale: data/database.db');
  
  // Initialize routes after database is ready
  initializeRoutes();
}).catch(err => {
  console.error('❌ Fatal: Database initialization failed:', err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0'; // Ascolta su tutte le interfacce per accettare connessioni dal telefono

server.listen(PORT, HOST, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🚀 Server privato con Real-Time avviato su porta ${PORT}`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`📚 API REST disponibili:`);
  console.log(`   - Locale: http://localhost:${PORT}/api`);
  console.log(`   - Rete: http://192.168.1.2:${PORT}/api`);
  console.log(`\n⚡ WebSocket/Socket.IO:`);
  console.log(`   - Attivo e pronto per connessioni real-time`);
  console.log(`   - Supporto: websocket, polling`);
  console.log(`\n✨ Funzionalità attive:`);
  console.log(`   ✅ Messaggi real-time (< 1 secondo)`);
  console.log(`   ✅ Chat di gruppo`);
  console.log(`   ✅ Messaggi vocali`);
  console.log(`   ✅ Messaggi video`);
  console.log(`   ✅ Condivisione file`);
  console.log(`   ✅ Status/Storie (24h)`);
  console.log(`   ✅ Chiamate vocali/video`);
  console.log(`   ✅ Indicatori di scrittura`);
  console.log(`   ✅ Conferme di lettura`);
  console.log(`   ✅ Conferme di consegna`);
  console.log(`\n💾 Database: SQLite locale - Nessun servizio esterno!`);
  console.log(`📱 Telefono: Configura app su http://192.168.1.2:${PORT}`);
  console.log(`\n${'='.repeat(60)}\n`);
});

module.exports = { app, server, io };
