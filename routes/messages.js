const express = require('express');
const db = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Setup multer for media messages
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subdir = 'messages';
    if (file.mimetype.startsWith('audio')) {
      subdir = 'voice';
    } else if (file.mimetype.startsWith('video')) {
      subdir = 'videos';
    } else if (file.mimetype.startsWith('image')) {
      subdir = 'images';
    } else {
      subdir = 'documents';
    }
    const dir = `uploads/${subdir}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
});

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ success: false, message: 'Non autorizzato' });
    }
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'private_server_secret_key');
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token non valido' });
  }
};

router.get('/', authenticate, (req, res) => {
  try {
    const messages = db.getAllMessages();
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero messaggi',
    });
  }
});

// Send text message
router.post('/', authenticate, (req, res) => {
  try {
    const { receiverId, groupId, content } = req.body;

    if ((!receiverId && !groupId) || !content) {
      return res.status(400).json({
        success: false,
        message: 'receiverId/groupId e content sono obbligatori',
      });
    }

    // Check if group message, verify membership
    if (groupId && !db.isGroupMember(groupId, req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Non sei membro di questo gruppo',
      });
    }

    const messageId = db.createMessage({
      senderId: req.userId,
      receiverId,
      groupId,
      content,
      messageType: 'text'
    });
    const message = db.getMessageById(messageId);

    // Emit real-time to socket
    if (req.app.io) {
      if (receiverId) {
        req.app.io.to(`user:${receiverId}`).emit('message:received', message);
      } else if (groupId) {
        req.app.io.to(`group:${groupId}`).emit('message:received', message);
      }
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione messaggio',
    });
  }
});

// Send media message (voice, video, image, document)
router.post('/media', authenticate, upload.single('media'), (req, res) => {
  try {
    const { receiverId, groupId, content, messageType, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File media obbligatorio',
      });
    }

    if (!receiverId && !groupId) {
      return res.status(400).json({
        success: false,
        message: 'receiverId o groupId obbligatorio',
      });
    }

    // Check if group message, verify membership
    if (groupId && !db.isGroupMember(groupId, req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Non sei membro di questo gruppo',
      });
    }

    // Determine message type from file
    let type = messageType || 'file';
    if (req.file.mimetype.startsWith('audio')) {
      type = 'voice';
    } else if (req.file.mimetype.startsWith('video')) {
      type = 'video';
    } else if (req.file.mimetype.startsWith('image')) {
      type = 'image';
    }

    const mediaUrl = req.file.path.replace(/\\/g, '/');
    const messageId = db.createMessage({
      senderId: req.userId,
      receiverId,
      groupId,
      content: content || '',
      messageType: type,
      mediaUrl: `/${mediaUrl}`,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      duration: duration ? parseInt(duration) : null
    });

    const message = db.getMessageById(messageId);

    // Emit real-time to socket
    if (req.app.io) {
      if (receiverId) {
        req.app.io.to(`user:${receiverId}`).emit('message:received', message);
      } else if (groupId) {
        req.app.io.to(`group:${groupId}`).emit('message:received', message);
      }
    }

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione messaggio media',
      error: error.message
    });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const message = db.getMessageById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Messaggio non trovato',
      });
    }
    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero messaggio',
    });
  }
});

// Get conversation messages
router.get('/conversation/:userId', authenticate, (req, res) => {
  try {
    const messages = db.getConversationMessages(req.userId, req.params.userId);
    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero conversazione',
    });
  }
});

// Mark message as read
router.put('/:id/read', authenticate, (req, res) => {
  try {
    db.markMessageAsRead(req.params.id);
    
    // Emit to socket
    if (req.app.io) {
      const message = db.getMessageById(req.params.id);
      if (message) {
        req.app.io.to(`user:${message.senderId}`).emit('message:read', {
          messageId: req.params.id,
          readBy: req.userId
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Messaggio segnato come letto',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento messaggio',
    });
  }
});

// Mark message as delivered
router.put('/:id/delivered', authenticate, (req, res) => {
  try {
    db.markMessageAsDelivered(req.params.id);
    
    // Emit to socket
    if (req.app.io) {
      const message = db.getMessageById(req.params.id);
      if (message) {
        req.app.io.to(`user:${message.senderId}`).emit('message:delivered', {
          messageId: req.params.id,
          deliveredTo: req.userId
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Messaggio segnato come consegnato',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento messaggio',
    });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const result = db.deleteMessage(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Messaggio non trovato',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Messaggio eliminato con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione messaggio',
    });
  }
});

module.exports = router;
