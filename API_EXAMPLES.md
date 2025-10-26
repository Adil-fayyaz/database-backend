# 📱 API Examples for Mobile/Web Apps

Complete examples for integrating PrivateServerX API in your mobile or web application.

---

## 🔑 Base Configuration

```javascript
const API_URL = 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});
```

---

## 👤 User Authentication

### Register User

```javascript
async function registerUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      // Save token
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Usage
const user = await registerUser('John Doe', 'john@example.com', 'password123');
```

### Login User

```javascript
async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
      return data.data;
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Usage
const user = await loginUser('john@example.com', 'password123');
```

### Get Current User

```javascript
async function getCurrentUser() {
  const response = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeader()
  });

  return response.json();
}
```

---

## 👥 Users

### Get All Users

```javascript
async function getAllUsers() {
  const response = await fetch(`${API_URL}/users`, {
    headers: getAuthHeader()
  });

  const data = await response.json();
  return data.data; // Array of users
}

// Usage
const users = await getAllUsers();
```

### Get User by ID

```javascript
async function getUserById(userId) {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    headers: getAuthHeader()
  });

  const data = await response.json();
  return data.data;
}

// Usage
const user = await getUserById('USER_ID_HERE');
```

---

## 💬 Messages

### Send a Message

```javascript
async function sendMessage(receiverId, content) {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: getAuthHeader(),
    body: JSON.stringify({ receiverId, content })
  });

  const data = await response.json();
  return data.data;
}

// Usage
const message = await sendMessage('USER_ID', 'Hello! This is my message.');
```

### Get All Messages

```javascript
async function getAllMessages() {
  const response = await fetch(`${API_URL}/messages`, {
    headers: getAuthHeader()
  });

  const data = await response.json();
  return data.data;
}

// Usage
const messages = await getAllMessages();
```

### Get Messages for Specific User

```javascript
async function getMessagesWithUser(userId) {
  const messages = await getAllMessages();
  
  // Filter messages with this user
  return messages.filter(msg => 
    msg.senderId._id === userId || 
    msg.receiverId._id === userId
  );
}

// Usage
const conversation = await getMessagesWithUser('USER_ID');
```

### Delete a Message

```javascript
async function deleteMessage(messageId) {
  const response = await fetch(`${API_URL}/messages/${messageId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  return response.json();
}

// Usage
await deleteMessage('MESSAGE_ID');
```

---

## 📁 Files

### Upload a File

```javascript
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/files`, {
    method: 'POST',
    headers: {
      'Authorization': getAuthHeader()['Authorization']
      // Don't set Content-Type for FormData
    },
    body: formData
  });

  const data = await response.json();
  return data.data;
}

// Usage
const fileInput = document.querySelector('#fileInput');
const file = await uploadFile(fileInput.files[0]);
console.log('File uploaded:', file.fileUrl);
```

### Get All Files

```javascript
async function getAllFiles() {
  const response = await fetch(`${API_URL}/files`, {
    headers: getAuthHeader()
  });

  const data = await response.json();
  return data.data;
}

// Usage
const files = await getAllFiles();
```

### Delete a File

```javascript
async function deleteFile(fileId) {
  const response = await fetch(`${API_URL}/files/${fileId}`, {
    method: 'DELETE',
    headers: getAuthHeader()
  });

  return response.json();
}

// Usage
await deleteFile('FILE_ID');
```

---

## 🔄 React Hook Example

```javascript
import { useState, useEffect } from 'react';

function useMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (receiverId, content) => {
    const newMessage = await sendMessage(receiverId, content);
    setMessages([...messages, newMessage]);
  };

  return { messages, loading, sendMessage, refresh: fetchMessages };
}

// Usage
function MessageComponent() {
  const { messages, loading, sendMessage } = useMessages();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {messages.map(msg => (
        <div key={msg._id}>{msg.content}</div>
      ))}
    </div>
  );
}
```

---

## 🔐 Error Handling

```javascript
async function apiCall(url, options) {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'API Error');
    }
    
    return data;
  } catch (error) {
    // Handle error
    if (error.message.includes('token')) {
      // Token expired
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw error;
  }
}

// Usage
const data = await apiCall(`${API_URL}/messages`, {
  headers: getAuthHeader()
});
```

---

## 🌐 Axios Example

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to all requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Usage
const messages = await api.get('/messages');
const newMessage = await api.post('/messages', {
  receiverId: 'USER_ID',
  content: 'Hello!'
});
```

---

## 📱 React Native Example

```javascript
// api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://YOUR_IP:5000/api';

export const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    await AsyncStorage.setItem('token', data.data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.data.user));
  }
  
  return data;
};

export const sendMessage = async (receiverId, content) => {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ receiverId, content })
  });
};
```

---

## ⚠️ Production Notes

For production use:
1. Change `http://localhost:5000` to your server IP/domain
2. Implement HTTPS
3. Handle token expiration
4. Add retry logic for network failures
5. Implement proper error handling

---

**All endpoints require authentication except registration and login.**

