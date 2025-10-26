const Database = require('better-sqlite3');
const path = require('path');

class DatabaseManager {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, 'data', 'database.db');
  }

  isConnected() {
    return this.db !== null;
  }

  async init() {
    try {
      // Create data directory if not exists
      const fs = require('fs');
      if (!fs.existsSync('data')) {
        fs.mkdirSync('data');
      }

      this.db = new Database(this.dbPath);
      
      console.log('📦 Creazione tabelle...');
      
      // Create users table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          isAdmin INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create messages table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          senderId INTEGER NOT NULL,
          receiverId INTEGER NOT NULL,
          content TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          read INTEGER DEFAULT 0,
          FOREIGN KEY (senderId) REFERENCES users(id),
          FOREIGN KEY (receiverId) REFERENCES users(id)
        )
      `);

      // Create files table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS files (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          filename TEXT NOT NULL,
          originalName TEXT NOT NULL,
          fileUrl TEXT NOT NULL,
          fileSize INTEGER NOT NULL,
          mimeType TEXT NOT NULL,
          uploadedBy INTEGER NOT NULL,
          date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (uploadedBy) REFERENCES users(id)
        )
      `);

      console.log('✅ Tabelle create con successo');
    } catch (error) {
      console.error('❌ Errore inizializzazione database:', error.message);
      throw error;
    }
  }

  // Users methods
  getUserByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }

  getUserById(id) {
    return this.db.prepare('SELECT id, name, email, isAdmin, createdAt FROM users WHERE id = ?').get(id);
  }

  getAllUsers() {
    return this.db.prepare('SELECT id, name, email, isAdmin, createdAt FROM users ORDER BY createdAt DESC').all();
  }

  createUser(name, email, hashedPassword) {
    const stmt = this.db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, hashedPassword);
    return { id: result.lastInsertRowid, name, email, isAdmin: 0 };
  }

  deleteUser(id) {
    return this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  // Messages methods
  getAllMessages() {
    return this.db.prepare(`
      SELECT m.*, 
        s.name as senderName, s.email as senderEmail,
        r.name as receiverName, r.email as receiverEmail
      FROM messages m
      LEFT JOIN users s ON m.senderId = s.id
      LEFT JOIN users r ON m.receiverId = r.id
      ORDER BY m.timestamp DESC
    `).all();
  }

  getMessageById(id) {
    return this.db.prepare(`
      SELECT m.*, 
        s.name as senderName, s.email as senderEmail,
        r.name as receiverName, r.email as receiverEmail
      FROM messages m
      LEFT JOIN users s ON m.senderId = s.id
      LEFT JOIN users r ON m.receiverId = r.id
      WHERE m.id = ?
    `).get(id);
  }

  createMessage(senderId, receiverId, content) {
    const stmt = this.db.prepare('INSERT INTO messages (senderId, receiverId, content) VALUES (?, ?, ?)');
    const result = stmt.run(senderId, receiverId, content);
    return result.lastInsertRowid;
  }

  deleteMessage(id) {
    return this.db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  }

  // Files methods
  getAllFiles() {
    return this.db.prepare(`
      SELECT f.*, u.name as uploaderName, u.email as uploaderEmail
      FROM files f
      LEFT JOIN users u ON f.uploadedBy = u.id
      ORDER BY f.date DESC
    `).all();
  }

  createFile(filename, originalName, fileUrl, fileSize, mimeType, uploadedBy) {
    const stmt = this.db.prepare('INSERT INTO files (filename, originalName, fileUrl, fileSize, mimeType, uploadedBy) VALUES (?, ?, ?, ?, ?, ?)');
    const result = stmt.run(filename, originalName, fileUrl, fileSize, mimeType, uploadedBy);
    return result.lastInsertRowid;
  }

  deleteFile(id) {
    return this.db.prepare('DELETE FROM files WHERE id = ?').run(id);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = DatabaseManager;

