const Database = require('../database');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    console.log('🌱 Inizio popolamento database...');
    
    const db = new Database();
    await db.init();

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.db.prepare('INSERT OR IGNORE INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)').run(
      'Admin User',
      'admin@example.com',
      adminPassword,
      1
    );

    // Create regular users
    const userPassword = await bcrypt.hash('user123', 10);
    db.db.prepare('INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)').run('John Doe', 'john@example.com', userPassword);
    db.db.prepare('INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)').run('Jane Smith', 'jane@example.com', userPassword);
    db.db.prepare('INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)').run('Bob Wilson', 'bob@example.com', userPassword);

    // Get users
    const users = db.getAllUsers();
    const admin = users.find(u => u.email === 'admin@example.com');
    const user1 = users.find(u => u.email === 'john@example.com');
    const user2 = users.find(u => u.email === 'jane@example.com');
    const user3 = users.find(u => u.email === 'bob@example.com');

    // Create messages
    const messages = [
      { senderId: admin.id, receiverId: user1.id, content: 'Benvenuto nella piattaforma, John!' },
      { senderId: user1.id, receiverId: user2.id, content: 'Ciao Jane, come va?' },
      { senderId: user2.id, receiverId: user1.id, content: 'Tutto bene grazie!' },
      { senderId: admin.id, receiverId: user3.id, content: 'Ecco le tue informazioni account, Bob.' },
    ];

    messages.forEach(msg => {
      db.createMessage(msg.senderId, msg.receiverId, msg.content);
    });

    console.log('✅ Database popolato con successo!');
    console.log('\n📊 Riepilogo:');
    console.log('  - Utenti: 4 (1 admin, 3 utenti)');
    console.log('  - Messaggi: 4');
    console.log('\n🔑 Credenziali di test:');
    console.log('  Admin:');
    console.log('    Email: admin@example.com');
    console.log('    Password: admin123');
    console.log('  User:');
    console.log('    Email: john@example.com');
    console.log('    Password: user123');
    
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore:', error);
    process.exit(1);
  }
};

seedDatabase();
