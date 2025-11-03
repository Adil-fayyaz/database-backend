const { Pool } = require('pg');

class DatabaseManager {
  constructor() {
    this.pool = null;
  }

  isConnected() {
    return this.pool !== null;
  }

  async init() {
    try {
      // Use Railway's PostgreSQL database URL
      this.pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      });

      console.log('📦 Connessione a PostgreSQL...');
      
      // Test connection
      await this.pool.query('SELECT NOW()');
      console.log('✅ Database connesso!');

      // Create tables
      await this.createTables();
      
      console.log('✅ Database inizializzato con successo!');
    } catch (error) {
      console.error('❌ Errore inizializzazione database:', error);
      throw error;
    }
  }

  async createTables() {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          phone TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'offline'
        )
      `);

      // Messages table
      await client.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          sender_id INTEGER NOT NULL,
          receiver_id INTEGER,
          group_id INTEGER,
          content TEXT NOT NULL,
          type TEXT DEFAULT 'text',
          file_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          delivered BOOLEAN DEFAULT FALSE,
          read BOOLEAN DEFAULT FALSE,
          FOREIGN KEY (sender_id) REFERENCES users(id)
        )
      `);

      // Groups table
      await client.query(`
        CREATE TABLE IF NOT EXISTS groups (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          created_by INTEGER NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id)
        )
      `);

      // Group members table
      await client.query(`
        CREATE TABLE IF NOT EXISTS group_members (
          id SERIAL PRIMARY KEY,
          group_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (group_id) REFERENCES groups(id),
          FOREIGN KEY (user_id) REFERENCES users(id),
          UNIQUE(group_id, user_id)
        )
      `);

      // Status table
      await client.query(`
        CREATE TABLE IF NOT EXISTS status (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          content TEXT,
          media_url TEXT,
          type TEXT DEFAULT 'text',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          expires_at TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Calls table
      await client.query(`
        CREATE TABLE IF NOT EXISTS calls (
          id SERIAL PRIMARY KEY,
          caller_id INTEGER NOT NULL,
          receiver_id INTEGER NOT NULL,
          type TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ended_at TIMESTAMP,
          duration INTEGER DEFAULT 0,
          FOREIGN KEY (caller_id) REFERENCES users(id),
          FOREIGN KEY (receiver_id) REFERENCES users(id)
        )
      `);

      // Files table
      await client.query(`
        CREATE TABLE IF NOT EXISTS files (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          filepath TEXT NOT NULL,
          mimetype TEXT,
          size INTEGER,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      // Create indexes
      await client.query('CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_messages_group ON messages(group_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_messages_created ON messages(created_at)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id)');
      await client.query('CREATE INDEX IF NOT EXISTS idx_group_members_user ON group_members(user_id)');

      await client.query('COMMIT');
      console.log('✅ Tabelle create con successo!');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // User methods
  async createUser(name, phone, hashedPassword) {
    const result = await this.pool.query(
      'INSERT INTO users (name, phone, password) VALUES ($1, $2, $3) RETURNING *',
      [name, phone, hashedPassword]
    );
    return result.rows[0];
  }

  async getUserByPhone(phone) {
    const result = await this.pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    return result.rows[0];
  }

  async getUserById(id) {
    const result = await this.pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  async getAllUsers() {
    const result = await this.pool.query('SELECT id, name, phone, status, last_seen FROM users ORDER BY name');
    return result.rows;
  }

  async updateUserStatus(userId, status) {
    await this.pool.query(
      'UPDATE users SET status = $1, last_seen = CURRENT_TIMESTAMP WHERE id = $2',
      [status, userId]
    );
  }

  // Message methods
  async createMessage(senderId, receiverId, groupId, content, type = 'text', fileUrl = null) {
    const result = await this.pool.query(
      'INSERT INTO messages (sender_id, receiver_id, group_id, content, type, file_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [senderId, receiverId, groupId, content, type, fileUrl]
    );
    return result.rows[0];
  }

  async getPrivateMessages(userId1, userId2, limit = 50) {
    const result = await this.pool.query(
      `SELECT m.*, u.name as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE ((m.sender_id = $1 AND m.receiver_id = $2) OR (m.sender_id = $2 AND m.receiver_id = $1))
       AND m.group_id IS NULL
       ORDER BY m.created_at DESC 
       LIMIT $3`,
      [userId1, userId2, limit]
    );
    return result.rows.reverse();
  }

  async getGroupMessages(groupId, limit = 50) {
    const result = await this.pool.query(
      `SELECT m.*, u.name as sender_name 
       FROM messages m 
       JOIN users u ON m.sender_id = u.id 
       WHERE m.group_id = $1 
       ORDER BY m.created_at DESC 
       LIMIT $2`,
      [groupId, limit]
    );
    return result.rows.reverse();
  }

  async markMessageDelivered(messageId) {
    await this.pool.query('UPDATE messages SET delivered = TRUE WHERE id = $1', [messageId]);
  }

  async markMessageRead(messageId) {
    await this.pool.query('UPDATE messages SET read = TRUE WHERE id = $1', [messageId]);
  }

  async getUndeliveredMessages(userId) {
    const result = await this.pool.query(
      'SELECT * FROM messages WHERE receiver_id = $1 AND delivered = FALSE ORDER BY created_at',
      [userId]
    );
    return result.rows;
  }

  // Group methods
  async createGroup(name, description, createdBy) {
    const result = await this.pool.query(
      'INSERT INTO groups (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description, createdBy]
    );
    return result.rows[0];
  }

  async getGroupById(groupId) {
    const result = await this.pool.query('SELECT * FROM groups WHERE id = $1', [groupId]);
    return result.rows[0];
  }

  async addGroupMember(groupId, userId) {
    await this.pool.query(
      'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [groupId, userId]
    );
  }

  async getGroupMembers(groupId) {
    const result = await this.pool.query(
      `SELECT u.id, u.name, u.phone, u.status 
       FROM users u 
       JOIN group_members gm ON u.id = gm.user_id 
       WHERE gm.group_id = $1`,
      [groupId]
    );
    return result.rows;
  }

  async getUserGroups(userId) {
    const result = await this.pool.query(
      `SELECT g.*, COUNT(gm2.user_id) as members_count
       FROM groups g 
       JOIN group_members gm ON g.id = gm.group_id 
       LEFT JOIN group_members gm2 ON g.id = gm2.group_id
       WHERE gm.user_id = $1
       GROUP BY g.id`,
      [userId]
    );
    return result.rows;
  }

  async getAllGroups() {
    const result = await this.pool.query(
      `SELECT g.*, COUNT(gm.user_id) as members_count
       FROM groups g 
       LEFT JOIN group_members gm ON g.id = gm.group_id
       GROUP BY g.id
       ORDER BY g.created_at DESC`
    );
    return result.rows;
  }

  // File methods
  async createFile(userId, filename, filepath, mimetype, size) {
    const result = await this.pool.query(
      'INSERT INTO files (user_id, filename, filepath, mimetype, size) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, filename, filepath, mimetype, size]
    );
    return result.rows[0];
  }

  async getAllFiles() {
    const result = await this.pool.query('SELECT * FROM files ORDER BY uploaded_at DESC');
    return result.rows;
  }

  async getFilesByUser(userId) {
    const result = await this.pool.query('SELECT * FROM files WHERE user_id = $1 ORDER BY uploaded_at DESC', [userId]);
    return result.rows;
  }

  // Status methods
  async createStatus(userId, content, mediaUrl, type) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const result = await this.pool.query(
      'INSERT INTO status (user_id, content, media_url, type, expires_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, content, mediaUrl, type, expiresAt]
    );
    return result.rows[0];
  }

  async getActiveStatuses() {
    const result = await this.pool.query(
      `SELECT s.*, u.name as user_name 
       FROM status s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.expires_at > CURRENT_TIMESTAMP 
       ORDER BY s.created_at DESC`
    );
    return result.rows;
  }

  // Call methods
  async createCall(callerId, receiverId, type) {
    const result = await this.pool.query(
      'INSERT INTO calls (caller_id, receiver_id, type) VALUES ($1, $2, $3) RETURNING *',
      [callerId, receiverId, type]
    );
    return result.rows[0];
  }

  async updateCallStatus(callId, status, duration = null) {
    if (duration !== null) {
      await this.pool.query(
        'UPDATE calls SET status = $1, duration = $2, ended_at = CURRENT_TIMESTAMP WHERE id = $3',
        [status, duration, callId]
      );
    } else {
      await this.pool.query('UPDATE calls SET status = $1 WHERE id = $2', [status, callId]);
    }
  }

  // Health check
  async healthCheck() {
    try {
      const result = await this.pool.query('SELECT COUNT(*) as count FROM users');
      return {
        status: 'healthy',
        users: parseInt(result.rows[0].count),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

// Singleton instance
const dbInstance = new DatabaseManager();

module.exports = dbInstance;

