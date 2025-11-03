/**
 * CLIENT-SIDE SOCKET.IO HELPER WITH AUTO-RECONNECTION
 * 
 * This helper provides robust Socket.IO connection with:
 * - Automatic reconnection with exponential backoff
 * - Heartbeat monitoring
 * - Offline message queue
 * - Connection state management
 * 
 * Usage example (JavaScript/React Native):
 * 
 * import io from 'socket.io-client';
 * import { SocketManager } from './client-socket-helper';
 * 
 * const socket = new SocketManager('http://192.168.1.2:3000', 'YOUR_JWT_TOKEN');
 * 
 * socket.on('message:received', (message) => {
 *   console.log('New message:', message);
 * });
 * 
 * socket.sendMessage(receiverId, 'Hello!');
 */

const io = require('socket.io-client');

class SocketManager {
  constructor(serverUrl, token) {
    this.serverUrl = serverUrl;
    this.token = token;
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.reconnectDelay = 1000; // Start with 1 second
    this.maxReconnectDelay = 30000; // Max 30 seconds
    this.heartbeatInterval = null;
    this.isAuthenticated = false;
    this.messageQueue = [];
    this.eventHandlers = new Map();
    
    this.connect();
  }

  connect() {
    console.log(`🔌 Connecting to ${this.serverUrl}...`);
    
    this.socket = io(this.serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      timeout: 20000,
      autoConnect: true,
    });

    this.setupEventHandlers();
    this.startHeartbeat();
  }

  setupEventHandlers() {
    // Connection established
    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      this.authenticate();
    });

    // Authentication successful
    this.socket.on('authenticated', (data) => {
      console.log('✅ Authenticated as user:', data.userId);
      this.isAuthenticated = true;
      
      if (data.offlineMessages > 0) {
        console.log(`📬 You have ${data.offlineMessages} offline messages`);
      }
      
      // Send queued messages
      this.flushMessageQueue();
    });

    // Offline messages received
    this.socket.on('messages:offline_queue', (messages) => {
      console.log(`📬 Received ${messages.length} offline messages`);
      messages.forEach(msg => {
        this.emit('message:received', msg);
      });
    });

    // Connection errors
    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
      this.handleReconnect();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Disconnected:', reason);
      this.isAuthenticated = false;
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, reconnect manually
        this.socket.connect();
      }
    });

    // Authentication error
    this.socket.on('authentication_error', (data) => {
      console.error('❌ Authentication error:', data.message);
      this.isAuthenticated = false;
    });

    // Online/Offline status
    this.socket.on('user:online', (data) => {
      this.emit('user:online', data);
    });

    this.socket.on('user:offline', (data) => {
      this.emit('user:offline', data);
    });

    // Message events
    this.socket.on('message:received', (message) => {
      this.emit('message:received', message);
    });

    this.socket.on('message:delivered', (data) => {
      this.emit('message:delivered', data);
    });

    this.socket.on('message:read', (data) => {
      this.emit('message:read', data);
    });

    // Typing indicators
    this.socket.on('typing:start', (data) => {
      this.emit('typing:start', data);
    });

    this.socket.on('typing:stop', (data) => {
      this.emit('typing:stop', data);
    });

    // Call events
    this.socket.on('call:incoming', (data) => {
      this.emit('call:incoming', data);
    });

    this.socket.on('call:offer', (data) => {
      this.emit('call:offer', data);
    });

    this.socket.on('call:answer', (data) => {
      this.emit('call:answer', data);
    });

    this.socket.on('call:ice-candidate', (data) => {
      this.emit('call:ice-candidate', data);
    });

    this.socket.on('call:rejected', (data) => {
      this.emit('call:rejected', data);
    });

    this.socket.on('call:ended', (data) => {
      this.emit('call:ended', data);
    });

    // Group events
    this.socket.on('group:created', (data) => {
      this.emit('group:created', data);
    });

    this.socket.on('group:updated', (data) => {
      this.emit('group:updated', data);
    });

    this.socket.on('group:deleted', (data) => {
      this.emit('group:deleted', data);
    });

    this.socket.on('group:member_added', (data) => {
      this.emit('group:member_added', data);
    });

    this.socket.on('group:member_removed', (data) => {
      this.emit('group:member_removed', data);
    });

    // Status events
    this.socket.on('status:created', (data) => {
      this.emit('status:created', data);
    });

    this.socket.on('status:deleted', (data) => {
      this.emit('status:deleted', data);
    });

    this.socket.on('status:viewed', (data) => {
      this.emit('status:viewed', data);
    });
  }

  authenticate() {
    if (this.token) {
      console.log('🔐 Authenticating...');
      this.socket.emit('authenticate', this.token);
    } else {
      console.error('❌ No token provided for authentication');
    }
  }

  startHeartbeat() {
    // Send heartbeat every 30 seconds
    this.heartbeatInterval = setInterval(() => {
      if (this.socket && this.socket.connected && this.isAuthenticated) {
        this.socket.emit('heartbeat');
      }
    }, 30000);
  }

  handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    
    // Exponential backoff
    const delay = Math.min(
      this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      if (!this.socket.connected) {
        this.socket.connect();
      }
    }, delay);
  }

  // Event emitter methods
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  off(event, handler) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Helper methods for common actions
  sendMessage(receiverId, content, groupId = null) {
    const messageData = {
      receiverId,
      groupId,
      content,
      timestamp: new Date().toISOString()
    };

    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('message:send', messageData);
    } else {
      console.log('📥 Message queued for sending when connected');
      this.messageQueue.push({ type: 'message:send', data: messageData });
    }
  }

  startTyping(receiverId = null, groupId = null) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('typing:start', { receiverId, groupId });
    }
  }

  stopTyping(receiverId = null, groupId = null) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('typing:stop', { receiverId, groupId });
    }
  }

  joinGroup(groupId) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('group:join', groupId);
    }
  }

  leaveGroup(groupId) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('group:leave', groupId);
    }
  }

  initiateCall(receiverId, callType, groupId = null) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('call:offer', {
        receiverId,
        groupId,
        callType,
        offer: null // WebRTC offer to be set by caller
      });
    }
  }

  answerCall(callerId, answer) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('call:answer', { callerId, answer });
    }
  }

  rejectCall(callerId) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('call:reject', { callerId });
    }
  }

  endCall(targetId = null, groupId = null) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('call:end', { targetId, groupId });
    }
  }

  sendIceCandidate(targetId, candidate) {
    if (this.isAuthenticated && this.socket.connected) {
      this.socket.emit('call:ice-candidate', { targetId, candidate });
    }
  }

  flushMessageQueue() {
    if (this.messageQueue.length === 0) return;

    console.log(`📤 Sending ${this.messageQueue.length} queued messages`);
    
    this.messageQueue.forEach(item => {
      this.socket.emit(item.type, item.data);
    });

    this.messageQueue = [];
  }

  updateToken(newToken) {
    this.token = newToken;
    if (this.socket && this.socket.connected) {
      this.authenticate();
    }
  }

  disconnect() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
    if (this.socket) {
      this.socket.disconnect();
    }
    this.isAuthenticated = false;
  }

  isConnected() {
    return this.socket && this.socket.connected && this.isAuthenticated;
  }

  getConnectionState() {
    return {
      connected: this.socket ? this.socket.connected : false,
      authenticated: this.isAuthenticated,
      queuedMessages: this.messageQueue.length,
      reconnectAttempts: this.reconnectAttempts
    };
  }
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SocketManager };
}

if (typeof window !== 'undefined') {
  window.SocketManager = SocketManager;
}



