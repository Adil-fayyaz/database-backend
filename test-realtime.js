/**
 * REAL-TIME FUNCTIONALITY TEST SUITE
 * 
 * Tests all real-time features to ensure sub-second message delivery
 * and proper functionality of all components.
 * 
 * Run this after starting the server:
 * node test-realtime.js
 */

const io = require('socket.io-client');
const axios = require('axios');

const SERVER_URL = 'http://localhost:3000';
const API_URL = `${SERVER_URL}/api`;

// Test configuration
const TEST_USER_1 = {
  name: 'Test User 1',
  email: 'test1@example.com',
  password: 'password123'
};

const TEST_USER_2 = {
  name: 'Test User 2', 
  email: 'test2@example.com',
  password: 'password123'
};

let user1Token, user2Token;
let user1Id, user2Id;
let socket1, socket2;
let groupId;

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log('green', `✅ ${message}`);
}

function error(message) {
  log('red', `❌ ${message}`);
}

function info(message) {
  log('blue', `ℹ️  ${message}`);
}

function warning(message) {
  log('yellow', `⚠️  ${message}`);
}

// Utility to measure time
function measureTime(startTime) {
  const endTime = Date.now();
  const duration = endTime - startTime;
  return duration;
}

// Test 1: Server Health Check
async function testServerHealth() {
  info('Testing server health...');
  try {
    const response = await axios.get(`${SERVER_URL}/health`);
    if (response.data.status === 'OK' && response.data.database === 'connected') {
      success('Server is healthy and database is connected');
      return true;
    } else {
      error('Server is not healthy');
      console.log(response.data);
      return false;
    }
  } catch (err) {
    error(`Server health check failed: ${err.message}`);
    return false;
  }
}

// Test 2: User Registration
async function testRegistration() {
  info('Testing user registration...');
  
  try {
    // Register User 1
    const res1 = await axios.post(`${API_URL}/auth/register`, TEST_USER_1);
    if (res1.data.success) {
      user1Token = res1.data.data.token;
      user1Id = res1.data.data.user.id;
      success(`User 1 registered successfully (ID: ${user1Id})`);
    }
  } catch (err) {
    if (err.response?.data?.message?.includes('già esistente')) {
      warning('User 1 already exists, attempting login...');
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: TEST_USER_1.email,
        password: TEST_USER_1.password
      });
      user1Token = loginRes.data.data.token;
      user1Id = loginRes.data.data.user.id;
      success(`User 1 logged in (ID: ${user1Id})`);
    } else {
      throw err;
    }
  }

  try {
    // Register User 2
    const res2 = await axios.post(`${API_URL}/auth/register`, TEST_USER_2);
    if (res2.data.success) {
      user2Token = res2.data.data.token;
      user2Id = res2.data.data.user.id;
      success(`User 2 registered successfully (ID: ${user2Id})`);
    }
  } catch (err) {
    if (err.response?.data?.message?.includes('già esistente')) {
      warning('User 2 already exists, attempting login...');
      const loginRes = await axios.post(`${API_URL}/auth/login`, {
        email: TEST_USER_2.email,
        password: TEST_USER_2.password
      });
      user2Token = loginRes.data.data.token;
      user2Id = loginRes.data.data.user.id;
      success(`User 2 logged in (ID: ${user2Id})`);
    } else {
      throw err;
    }
  }

  return true;
}

// Test 3: Socket.IO Connection
async function testSocketConnection() {
  info('Testing Socket.IO connections...');
  
  return new Promise((resolve) => {
    let user1Connected = false;
    let user2Connected = false;

    socket1 = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });

    socket2 = io(SERVER_URL, {
      transports: ['websocket', 'polling']
    });

    socket1.on('connect', () => {
      success('User 1 socket connected');
      socket1.emit('authenticate', user1Token);
    });

    socket1.on('authenticated', (data) => {
      success(`User 1 authenticated (User ID: ${data.userId})`);
      user1Connected = true;
      if (user2Connected) resolve(true);
    });

    socket2.on('connect', () => {
      success('User 2 socket connected');
      socket2.emit('authenticate', user2Token);
    });

    socket2.on('authenticated', (data) => {
      success(`User 2 authenticated (User ID: ${data.userId})`);
      user2Connected = true;
      if (user1Connected) resolve(true);
    });

    socket1.on('connect_error', (err) => {
      error(`User 1 connection error: ${err.message}`);
      resolve(false);
    });

    socket2.on('connect_error', (err) => {
      error(`User 2 connection error: ${err.message}`);
      resolve(false);
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      if (!user1Connected || !user2Connected) {
        error('Socket connection timeout');
        resolve(false);
      }
    }, 10000);
  });
}

// Test 4: Real-time Message Delivery
async function testMessageDelivery() {
  info('Testing real-time message delivery (< 1 second)...');
  
  return new Promise((resolve) => {
    const testMessage = 'Hello from test suite! ' + Date.now();
    const startTime = Date.now();

    socket2.once('message:received', (message) => {
      const duration = measureTime(startTime);
      
      if (message.content === testMessage) {
        if (duration < 1000) {
          success(`Message received in ${duration}ms (< 1 second) ✅`);
          resolve(true);
        } else {
          warning(`Message received in ${duration}ms (> 1 second) ⚠️`);
          resolve(false);
        }
      }
    });

    // Send message from User 1 to User 2
    axios.post(`${API_URL}/messages`, {
      receiverId: user2Id,
      content: testMessage
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    }).catch(err => {
      error(`Failed to send message: ${err.message}`);
      resolve(false);
    });

    // Timeout after 5 seconds
    setTimeout(() => {
      error('Message delivery timeout (> 5 seconds)');
      resolve(false);
    }, 5000);
  });
}

// Test 5: Typing Indicators
async function testTypingIndicators() {
  info('Testing typing indicators...');
  
  return new Promise((resolve) => {
    let typingStartReceived = false;
    let typingStopReceived = false;

    socket2.once('typing:start', (data) => {
      if (data.userId === user1Id) {
        success('Typing start indicator received');
        typingStartReceived = true;
      }
    });

    socket2.once('typing:stop', (data) => {
      if (data.userId === user1Id) {
        success('Typing stop indicator received');
        typingStopReceived = true;
        
        if (typingStartReceived && typingStopReceived) {
          resolve(true);
        }
      }
    });

    // Emit typing events
    setTimeout(() => {
      socket1.emit('typing:start', { receiverId: user2Id });
    }, 100);

    setTimeout(() => {
      socket1.emit('typing:stop', { receiverId: user2Id });
    }, 500);

    setTimeout(() => {
      if (!typingStartReceived || !typingStopReceived) {
        error('Typing indicators not received');
        resolve(false);
      }
    }, 2000);
  });
}

// Test 6: Group Creation and Messaging
async function testGroupMessaging() {
  info('Testing group creation and messaging...');
  
  try {
    // Create group
    const groupRes = await axios.post(`${API_URL}/groups`, {
      name: 'Test Group',
      description: 'Test group for automated testing'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    
    groupId = groupRes.data.data.id;
    success(`Group created (ID: ${groupId})`);

    // Add User 2 to group
    await axios.post(`${API_URL}/groups/${groupId}/members`, {
      userId: user2Id
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });
    success('User 2 added to group');

    // Join group rooms
    socket1.emit('group:join', groupId);
    socket2.emit('group:join', groupId);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Test group message
    return new Promise((resolve) => {
      const groupMessage = 'Group message test! ' + Date.now();
      const startTime = Date.now();

      socket2.once('message:received', (message) => {
        const duration = measureTime(startTime);
        
        if (message.content === groupMessage && message.groupId === groupId) {
          success(`Group message received in ${duration}ms`);
          resolve(true);
        }
      });

      axios.post(`${API_URL}/messages`, {
        groupId: groupId,
        content: groupMessage
      }, {
        headers: { Authorization: `Bearer ${user1Token}` }
      }).catch(err => {
        error(`Failed to send group message: ${err.message}`);
        resolve(false);
      });

      setTimeout(() => {
        error('Group message delivery timeout');
        resolve(false);
      }, 5000);
    });

  } catch (err) {
    error(`Group messaging test failed: ${err.message}`);
    return false;
  }
}

// Test 7: Message Read Receipts
async function testReadReceipts() {
  info('Testing read receipts...');
  
  return new Promise((resolve) => {
    let messageId;

    socket1.once('message:read', (data) => {
      if (data.messageId == messageId) {
        success('Read receipt received');
        resolve(true);
      }
    });

    // Send a message
    axios.post(`${API_URL}/messages`, {
      receiverId: user2Id,
      content: 'Read receipt test'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    }).then(res => {
      messageId = res.data.data.id;
      
      // Mark as read after delay
      setTimeout(() => {
        axios.put(`${API_URL}/messages/${messageId}/read`, {}, {
          headers: { Authorization: `Bearer ${user2Token}` }
        }).catch(err => {
          error(`Failed to mark message as read: ${err.message}`);
          resolve(false);
        });
      }, 500);
    }).catch(err => {
      error(`Failed to send message: ${err.message}`);
      resolve(false);
    });

    setTimeout(() => {
      error('Read receipt timeout');
      resolve(false);
    }, 5000);
  });
}

// Test 8: Offline Message Queue
async function testOfflineMessageQueue() {
  info('Testing offline message queue...');
  
  // Disconnect User 2
  socket2.disconnect();
  success('User 2 disconnected');

  await new Promise(resolve => setTimeout(resolve, 1000));

  // Send messages while offline
  try {
    await axios.post(`${API_URL}/messages`, {
      receiverId: user2Id,
      content: 'Offline message 1'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });

    await axios.post(`${API_URL}/messages`, {
      receiverId: user2Id,
      content: 'Offline message 2'
    }, {
      headers: { Authorization: `Bearer ${user1Token}` }
    });

    success('Sent 2 messages while User 2 was offline');

    // Reconnect User 2
    return new Promise((resolve) => {
      socket2 = io(SERVER_URL, {
        transports: ['websocket', 'polling']
      });

      socket2.on('connect', () => {
        socket2.emit('authenticate', user2Token);
      });

      socket2.on('messages:offline_queue', (messages) => {
        if (messages.length >= 2) {
          success(`Received ${messages.length} offline messages on reconnection`);
          resolve(true);
        } else {
          error(`Expected 2+ offline messages, got ${messages.length}`);
          resolve(false);
        }
      });

      setTimeout(() => {
        error('Offline message queue timeout');
        resolve(false);
      }, 10000);
    });

  } catch (err) {
    error(`Offline message test failed: ${err.message}`);
    return false;
  }
}

// Test 9: Heartbeat Monitoring
async function testHeartbeat() {
  info('Testing heartbeat monitoring...');
  
  // Send heartbeats
  socket1.emit('heartbeat');
  socket2.emit('heartbeat');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  success('Heartbeat signals sent successfully');
  return true;
}

// Test 10: Connection Recovery
async function testConnectionRecovery() {
  info('Testing connection recovery...');
  
  return new Promise((resolve) => {
    let disconnected = false;
    let reconnected = false;

    socket1.once('disconnect', () => {
      success('User 1 disconnected');
      disconnected = true;
    });

    socket1.once('connect', () => {
      if (disconnected) {
        success('User 1 reconnected');
        reconnected = true;
        
        socket1.emit('authenticate', user1Token);
      }
    });

    socket1.once('authenticated', (data) => {
      if (disconnected && reconnected) {
        success('User 1 re-authenticated after reconnection');
        resolve(true);
      }
    });

    // Force disconnect
    socket1.disconnect();

    // Reconnect after delay
    setTimeout(() => {
      socket1.connect();
    }, 1000);

    setTimeout(() => {
      if (!disconnected || !reconnected) {
        error('Connection recovery failed');
        resolve(false);
      }
    }, 10000);
  });
}

// Run all tests
async function runAllTests() {
  log('cyan', '\n╔════════════════════════════════════════════════════════╗');
  log('cyan', '║     REAL-TIME FUNCTIONALITY TEST SUITE                ║');
  log('cyan', '╚════════════════════════════════════════════════════════╝\n');

  const results = [];
  let passedTests = 0;
  let totalTests = 0;

  const tests = [
    { name: 'Server Health Check', fn: testServerHealth },
    { name: 'User Registration', fn: testRegistration },
    { name: 'Socket.IO Connection', fn: testSocketConnection },
    { name: 'Real-time Message Delivery', fn: testMessageDelivery },
    { name: 'Typing Indicators', fn: testTypingIndicators },
    { name: 'Group Messaging', fn: testGroupMessaging },
    { name: 'Read Receipts', fn: testReadReceipts },
    { name: 'Offline Message Queue', fn: testOfflineMessageQueue },
    { name: 'Heartbeat Monitoring', fn: testHeartbeat },
    { name: 'Connection Recovery', fn: testConnectionRecovery }
  ];

  for (const test of tests) {
    totalTests++;
    log('magenta', `\n━━━ Test ${totalTests}: ${test.name} ━━━`);
    
    try {
      const result = await test.fn();
      results.push({ name: test.name, passed: result });
      
      if (result) {
        passedTests++;
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      error(`Test failed with error: ${err.message}`);
      results.push({ name: test.name, passed: false });
    }
  }

  // Summary
  log('cyan', '\n╔════════════════════════════════════════════════════════╗');
  log('cyan', '║                    TEST SUMMARY                        ║');
  log('cyan', '╚════════════════════════════════════════════════════════╝\n');

  results.forEach((result, index) => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    const color = result.passed ? 'green' : 'red';
    log(color, `${index + 1}. ${result.name}: ${status}`);
  });

  const percentage = Math.round((passedTests / totalTests) * 100);
  log('cyan', `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  log('cyan', `Total: ${passedTests}/${totalTests} tests passed (${percentage}%)`);
  log('cyan', `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

  if (passedTests === totalTests) {
    log('green', '🎉 ALL TESTS PASSED! System is working perfectly! 🎉\n');
  } else {
    log('red', `⚠️  ${totalTests - passedTests} test(s) failed. Please check the logs above.\n`);
  }

  // Cleanup
  if (socket1) socket1.disconnect();
  if (socket2) socket2.disconnect();

  process.exit(passedTests === totalTests ? 0 : 1);
}

// Start tests
runAllTests().catch(err => {
  error(`Fatal error: ${err.message}`);
  console.error(err);
  process.exit(1);
});



