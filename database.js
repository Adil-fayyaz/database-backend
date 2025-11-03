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
          receiverId INTEGER,
          groupId INTEGER,
          content TEXT NOT NULL,
          messageType TEXT DEFAULT 'text',
          mediaUrl TEXT,
          fileName TEXT,
          fileSize INTEGER,
          mimeType TEXT,
          duration INTEGER,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          read INTEGER DEFAULT 0,
          delivered INTEGER DEFAULT 0,
          FOREIGN KEY (senderId) REFERENCES users(id),
          FOREIGN KEY (receiverId) REFERENCES users(id),
          FOREIGN KEY (groupId) REFERENCES groups(id)
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

      // Create groups table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS groups (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT,
          avatar TEXT,
          createdBy INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (createdBy) REFERENCES users(id)
        )
      `);

      // Create group_members table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS group_members (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          groupId INTEGER NOT NULL,
          userId INTEGER NOT NULL,
          role TEXT DEFAULT 'member',
          joinedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (groupId) REFERENCES groups(id),
          FOREIGN KEY (userId) REFERENCES users(id),
          UNIQUE(groupId, userId)
        )
      `);

      // Create status table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS status (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId INTEGER NOT NULL,
          mediaType TEXT NOT NULL,
          mediaUrl TEXT NOT NULL,
          caption TEXT,
          duration INTEGER DEFAULT 24,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          expiresAt DATETIME,
          FOREIGN KEY (userId) REFERENCES users(id)
        )
      `);

      // Create status_views table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS status_views (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          statusId INTEGER NOT NULL,
          viewerId INTEGER NOT NULL,
          viewedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (statusId) REFERENCES status(id),
          FOREIGN KEY (viewerId) REFERENCES users(id),
          UNIQUE(statusId, viewerId)
        )
      `);

      // Create calls table
      this.db.exec(`
        CREATE TABLE IF NOT EXISTS calls (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          callerId INTEGER NOT NULL,
          receiverId INTEGER,
          groupId INTEGER,
          callType TEXT NOT NULL,
          status TEXT DEFAULT 'calling',
          startTime DATETIME DEFAULT CURRENT_TIMESTAMP,
          endTime DATETIME,
          duration INTEGER,
          FOREIGN KEY (callerId) REFERENCES users(id),
          FOREIGN KEY (receiverId) REFERENCES users(id),
          FOREIGN KEY (groupId) REFERENCES groups(id)
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
        r.name as receiverName, r.email as receiverEmail,
        g.name as groupName
      FROM messages m
      LEFT JOIN users s ON m.senderId = s.id
      LEFT JOIN users r ON m.receiverId = r.id
      LEFT JOIN groups g ON m.groupId = g.id
      ORDER BY m.timestamp DESC
    `).all();
  }

  getMessageById(id) {
    return this.db.prepare(`
      SELECT m.*, 
        s.name as senderName, s.email as senderEmail,
        r.name as receiverName, r.email as receiverEmail,
        g.name as groupName
      FROM messages m
      LEFT JOIN users s ON m.senderId = s.id
      LEFT JOIN users r ON m.receiverId = r.id
      LEFT JOIN groups g ON m.groupId = g.id
      WHERE m.id = ?
    `).get(id);
  }

  getConversationMessages(userId1, userId2) {
    return this.db.prepare(`
      SELECT m.*, 
        s.name as senderName, s.email as senderEmail,
        r.name as receiverName, r.email as receiverEmail
      FROM messages m
      LEFT JOIN users s ON m.senderId = s.id
      LEFT JOIN users r ON m.receiverId = r.id
      WHERE (m.senderId = ? AND m.receiverId = ?) OR (m.senderId = ? AND m.receiverId = ?)
      ORDER BY m.timestamp ASC
    `).all(userId1, userId2, userId2, userId1);
  }

  getGroupMessages(groupId) {
    return this.db.prepare(`
      SELECT m.*, 
        s.name as senderName, s.email as senderEmail
      FROM messages m
      LEFT JOIN users s ON m.senderId = s.id
      WHERE m.groupId = ?
      ORDER BY m.timestamp ASC
    `).all(groupId);
  }

  createMessage(data) {
    const { senderId, receiverId, groupId, content, messageType, mediaUrl, fileName, fileSize, mimeType, duration } = data;
    const stmt = this.db.prepare(`
      INSERT INTO messages (senderId, receiverId, groupId, content, messageType, mediaUrl, fileName, fileSize, mimeType, duration) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(senderId, receiverId || null, groupId || null, content, messageType || 'text', mediaUrl || null, fileName || null, fileSize || null, mimeType || null, duration || null);
    return result.lastInsertRowid;
  }

  markMessageAsRead(id) {
    return this.db.prepare('UPDATE messages SET read = 1 WHERE id = ?').run(id);
  }

  markMessageAsDelivered(id) {
    return this.db.prepare('UPDATE messages SET delivered = 1 WHERE id = ?').run(id);
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

  // Groups methods
  getAllGroups() {
    return this.db.prepare(`
      SELECT g.*, u.name as creatorName, u.email as creatorEmail,
        (SELECT COUNT(*) FROM group_members WHERE groupId = g.id) as memberCount
      FROM groups g
      LEFT JOIN users u ON g.createdBy = u.id
      ORDER BY g.createdAt DESC
    `).all();
  }

  getGroupById(id) {
    return this.db.prepare(`
      SELECT g.*, u.name as creatorName, u.email as creatorEmail
      FROM groups g
      LEFT JOIN users u ON g.createdBy = u.id
      WHERE g.id = ?
    `).get(id);
  }

  getUserGroups(userId) {
    return this.db.prepare(`
      SELECT g.*, u.name as creatorName,
        (SELECT COUNT(*) FROM group_members WHERE groupId = g.id) as memberCount
      FROM groups g
      LEFT JOIN users u ON g.createdBy = u.id
      INNER JOIN group_members gm ON g.id = gm.groupId
      WHERE gm.userId = ?
      ORDER BY g.createdAt DESC
    `).all(userId);
  }

  createGroup(name, description, avatar, createdBy) {
    const stmt = this.db.prepare('INSERT INTO groups (name, description, avatar, createdBy) VALUES (?, ?, ?, ?)');
    const result = stmt.run(name, description || null, avatar || null, createdBy);
    const groupId = result.lastInsertRowid;
    // Add creator as admin
    this.addGroupMember(groupId, createdBy, 'admin');
    return groupId;
  }

  updateGroup(id, name, description, avatar) {
    return this.db.prepare('UPDATE groups SET name = ?, description = ?, avatar = ? WHERE id = ?')
      .run(name, description, avatar, id);
  }

  deleteGroup(id) {
    this.db.prepare('DELETE FROM group_members WHERE groupId = ?').run(id);
    return this.db.prepare('DELETE FROM groups WHERE id = ?').run(id);
  }

  // Group members methods
  getGroupMembers(groupId) {
    return this.db.prepare(`
      SELECT gm.*, u.name, u.email
      FROM group_members gm
      LEFT JOIN users u ON gm.userId = u.id
      WHERE gm.groupId = ?
      ORDER BY gm.joinedAt ASC
    `).all(groupId);
  }

  addGroupMember(groupId, userId, role = 'member') {
    try {
      const stmt = this.db.prepare('INSERT INTO group_members (groupId, userId, role) VALUES (?, ?, ?)');
      return stmt.run(groupId, userId, role);
    } catch (error) {
      // Member already exists
      return null;
    }
  }

  removeGroupMember(groupId, userId) {
    return this.db.prepare('DELETE FROM group_members WHERE groupId = ? AND userId = ?').run(groupId, userId);
  }

  updateMemberRole(groupId, userId, role) {
    return this.db.prepare('UPDATE group_members SET role = ? WHERE groupId = ? AND userId = ?')
      .run(role, groupId, userId);
  }

  isGroupMember(groupId, userId) {
    const result = this.db.prepare('SELECT id FROM group_members WHERE groupId = ? AND userId = ?')
      .get(groupId, userId);
    return !!result;
  }

  // Status methods
  getAllStatus() {
    return this.db.prepare(`
      SELECT s.*, u.name as userName, u.email as userEmail,
        (SELECT COUNT(*) FROM status_views WHERE statusId = s.id) as viewCount
      FROM status s
      LEFT JOIN users u ON s.userId = u.id
      WHERE datetime(s.expiresAt) > datetime('now')
      ORDER BY s.createdAt DESC
    `).all();
  }

  getUserStatus(userId) {
    return this.db.prepare(`
      SELECT s.*,
        (SELECT COUNT(*) FROM status_views WHERE statusId = s.id) as viewCount
      FROM status s
      WHERE s.userId = ? AND datetime(s.expiresAt) > datetime('now')
      ORDER BY s.createdAt DESC
    `).all(userId);
  }

  createStatus(userId, mediaType, mediaUrl, caption, duration = 24) {
    const expiresAt = new Date(Date.now() + duration * 60 * 60 * 1000).toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO status (userId, mediaType, mediaUrl, caption, duration, expiresAt) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(userId, mediaType, mediaUrl, caption || null, duration, expiresAt);
    return result.lastInsertRowid;
  }

  deleteStatus(id) {
    this.db.prepare('DELETE FROM status_views WHERE statusId = ?').run(id);
    return this.db.prepare('DELETE FROM status WHERE id = ?').run(id);
  }

  viewStatus(statusId, viewerId) {
    try {
      const stmt = this.db.prepare('INSERT INTO status_views (statusId, viewerId) VALUES (?, ?)');
      return stmt.run(statusId, viewerId);
    } catch (error) {
      // Already viewed
      return null;
    }
  }

  getStatusViews(statusId) {
    return this.db.prepare(`
      SELECT sv.*, u.name, u.email
      FROM status_views sv
      LEFT JOIN users u ON sv.viewerId = u.id
      WHERE sv.statusId = ?
      ORDER BY sv.viewedAt DESC
    `).all(statusId);
  }

  // Calls methods
  getAllCalls() {
    return this.db.prepare(`
      SELECT c.*,
        caller.name as callerName, caller.email as callerEmail,
        receiver.name as receiverName, receiver.email as receiverEmail,
        g.name as groupName
      FROM calls c
      LEFT JOIN users caller ON c.callerId = caller.id
      LEFT JOIN users receiver ON c.receiverId = receiver.id
      LEFT JOIN groups g ON c.groupId = g.id
      ORDER BY c.startTime DESC
    `).all();
  }

  getUserCalls(userId) {
    return this.db.prepare(`
      SELECT c.*,
        caller.name as callerName, caller.email as callerEmail,
        receiver.name as receiverName, receiver.email as receiverEmail,
        g.name as groupName
      FROM calls c
      LEFT JOIN users caller ON c.callerId = caller.id
      LEFT JOIN users receiver ON c.receiverId = receiver.id
      LEFT JOIN groups g ON c.groupId = g.id
      WHERE c.callerId = ? OR c.receiverId = ?
      ORDER BY c.startTime DESC
    `).all(userId, userId);
  }

  createCall(callerId, receiverId, groupId, callType) {
    const stmt = this.db.prepare(`
      INSERT INTO calls (callerId, receiverId, groupId, callType) 
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(callerId, receiverId || null, groupId || null, callType);
    return result.lastInsertRowid;
  }

  updateCallStatus(id, status) {
    return this.db.prepare('UPDATE calls SET status = ? WHERE id = ?').run(status, id);
  }

  endCall(id, duration) {
    return this.db.prepare('UPDATE calls SET status = ?, endTime = CURRENT_TIMESTAMP, duration = ? WHERE id = ?')
      .run('ended', duration, id);
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = DatabaseManager;

