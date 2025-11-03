/**
 * CONFIGURAZIONE CENTRALIZZATA
 * 
 * Cambia server facilmente modificando solo questo file o le variabili d'ambiente
 */

require('dotenv').config();

// Validazione JWT_SECRET
function getJWTSecret() {
  const secret = process.env.JWT_SECRET;
  
  if (!secret || secret === 'CHANGE_THIS_SECRET' || secret.length < 32) {
    console.error('\n❌ ERRORE CRITICO: JWT_SECRET non configurato correttamente!');
    console.error('   Genera un secret sicuro con: node scripts/generate-secret.js');
    console.error('   Oppure aggiungi nel file .env: JWT_SECRET=tuo_secret_minimo_32_caratteri\n');
    process.exit(1);
  }
  
  return secret;
}

// Configurazione ambiente
const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';
const IS_DEVELOPMENT = ENV === 'development';

module.exports = {
  // Informazioni ambiente
  env: {
    current: ENV,
    isProduction: IS_PRODUCTION,
    isDevelopment: IS_DEVELOPMENT,
  },

  // Configurazione Server
  server: {
    port: parseInt(process.env.PORT) || 3000,
    host: process.env.SERVER_HOST || '0.0.0.0',
    name: process.env.SERVER_NAME || 'Private Messaging Server',
    
    // URL pubblico del server (per generare link)
    publicUrl: process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 3000}`,
  },

  // CORS - Origini permesse
  cors: {
    // Lista di origini permesse (separare con virgola nel .env)
    origins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',').map(o => o.trim())
      : ['http://localhost:3000', 'http://localhost:5173'],
    
    // Pattern regex per IP locali (LAN)
    localIPPattern: process.env.LOCAL_IP_PATTERN 
      ? new RegExp(process.env.LOCAL_IP_PATTERN)
      : /^http:\/\/192\.168\./,
    
    credentials: true,
  },

  // JWT Authentication
  jwt: {
    secret: getJWTSecret(),
    expiresIn: process.env.JWT_EXPIRE || '7d',
    algorithm: 'HS256',
  },

  // Database SQLite
  database: {
    path: process.env.DB_PATH || './data/database.db',
    
    // Cache size in KB (default 64MB)
    cacheSize: parseInt(process.env.DB_CACHE_SIZE) || 64000,
    
    // Enable WAL mode for better concurrency
    walMode: process.env.DB_WAL_MODE !== 'false',
    
    // Backup automatico
    autoBackup: process.env.DB_AUTO_BACKUP === 'true',
    backupInterval: parseInt(process.env.DB_BACKUP_INTERVAL) || 86400000, // 24h default
  },

  // Upload File
  upload: {
    // Dimensione massima file in bytes (default 100MB)
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600,
    
    // Directory upload
    directory: process.env.UPLOAD_DIR || './uploads',
    
    // Tipi file permessi
    allowedMimeTypes: process.env.ALLOWED_MIME_TYPES
      ? process.env.ALLOWED_MIME_TYPES.split(',')
      : [
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'video/mp4', 'video/webm', 'video/quicktime',
          'audio/mpeg', 'audio/wav', 'audio/webm', 'audio/ogg',
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
  },

  // Socket.IO Real-time
  socketio: {
    // Ping timeout (ms)
    pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT) || 60000,
    
    // Ping interval (ms)
    pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL) || 25000,
    
    // Transports
    transports: ['websocket', 'polling'],
    
    // Heartbeat interval per client (ms)
    heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL) || 30000,
    
    // Heartbeat timeout (ms)
    heartbeatTimeout: parseInt(process.env.HEARTBEAT_TIMEOUT) || 60000,
  },

  // Rate Limiting
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 900000, // 15 min
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || (IS_PRODUCTION ? 'info' : 'debug'),
    format: process.env.LOG_FORMAT || 'combined',
  },

  // Security
  security: {
    // Helmet configurazione
    helmet: process.env.HELMET_ENABLED !== 'false',
    
    // HTTPS redirect in produzione
    forceHttps: process.env.FORCE_HTTPS === 'true' && IS_PRODUCTION,
    
    // Bcrypt rounds per password hashing
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS) || 10,
  },

  // Features Toggle (abilita/disabilita funzionalità)
  features: {
    groups: process.env.FEATURE_GROUPS !== 'false',
    status: process.env.FEATURE_STATUS !== 'false',
    calls: process.env.FEATURE_CALLS !== 'false',
    fileUpload: process.env.FEATURE_FILE_UPLOAD !== 'false',
    voiceMessages: process.env.FEATURE_VOICE_MESSAGES !== 'false',
    videoMessages: process.env.FEATURE_VIDEO_MESSAGES !== 'false',
  },

  // Encryption (per E2E encryption futura)
  encryption: {
    enabled: process.env.E2E_ENCRYPTION === 'true',
    algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
  },
};
