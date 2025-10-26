const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const fileRoutes = require('./routes/files');

// Import database
const Database = require('./database');

// Create data directory if not exists
if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

// Initialize database
const db = new Database();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use('/uploads', express.static('uploads'));
app.use('/data', express.static('data'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/files', fileRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🔐 AdilPrivateServer - Server Privato',
    status: 'running',
    timestamp: new Date().toISOString(),
    database: db.isConnected() ? 'connected' : 'disconnected',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      messages: '/api/messages',
      files: '/api/files',
      health: '/health'
    },
    note: 'Dashboard disponibile su http://localhost:3000'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: db.isConnected() ? 'connected' : 'disconnected'
  });
});

// Initialize database on startup
db.init().then(() => {
  console.log('✅ Database inizializzato con successo');
  console.log('🗄️  Database locale: data/database.db');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server privato avviato su porta ${PORT}`);
  console.log(`📚 API disponibili: http://localhost:${PORT}/api`);
  console.log(`💾 Tutto è locale - Nessun servizio esterno!`);
});

module.exports = app;
