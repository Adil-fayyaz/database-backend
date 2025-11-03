// Quick manual test to verify the system works
const axios = require('axios');
const io = require('socket.io-client');

const SERVER_URL = 'http://localhost:3000';

async function quickTest() {
  console.log('🧪 Quick System Test\n');
  
  // 1. Health check
  try {
    const health = await axios.get(`${SERVER_URL}/health`);
    console.log('✅ Server:', health.data.status);
    console.log('✅ Database:', health.data.database);
    console.log('✅ Connected users:', health.data.connectedUsers);
  } catch (err) {
    console.log('❌ Server not reachable');
    process.exit(1);
  }
  
  // 2. Register test user
  try {
    const email = `test_${Date.now()}@example.com`;
    const register = await axios.post(`${SERVER_URL}/api/auth/register`, {
      name: 'Test User',
      email: email,
      password: 'password123'
    });
    
    console.log('\n✅ User registered:', register.data.data.user.id);
    const token = register.data.data.token;
    const userId = register.data.data.user.id;
    
    // 3. Socket.IO connection
    const socket = io(SERVER_URL);
    
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      socket.emit('authenticate', token);
    });
    
    socket.on('authenticated', (data) => {
      console.log('✅ Socket authenticated');
      
      // 4. Test database operations
      testDatabase(token, userId).then(() => {
        socket.disconnect();
        console.log('\n✅ ALL BASIC TESTS PASSED!\n');
        process.exit(0);
      }).catch(err => {
        console.log('\n❌ Test failed:', err.message);
        socket.disconnect();
        process.exit(1);
      });
    });
    
    socket.on('connect_error', (err) => {
      console.log('❌ Socket error:', err.message);
      process.exit(1);
    });
    
  } catch (err) {
    console.log('❌ Registration failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

async function testDatabase(token, userId) {
  const headers = { Authorization: `Bearer ${token}` };
  
  // Test getting users
  try {
    const users = await axios.get(`${SERVER_URL}/api/users`, { headers });
    console.log(`✅ Database read works (${users.data.count} users)`);
  } catch (err) {
    throw new Error(`Database read failed: ${err.response?.status || err.message}`);
  }
  
  // Test creating a message (if there are at least 2 users)
  try {
    const users = await axios.get(`${SERVER_URL}/api/users`, { headers });
    if (users.data.count >= 2) {
      const otherUser = users.data.data.find(u => u.id !== userId);
      if (otherUser) {
        const message = await axios.post(`${SERVER_URL}/api/messages`, {
          receiverId: otherUser.id,
          content: 'Test message'
        }, { headers });
        console.log('✅ Database write works (message created)');
      }
    }
  } catch (err) {
    throw new Error(`Database write failed: ${err.response?.status || err.message}`);
  }
  
  return true;
}

quickTest();



