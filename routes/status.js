const express = require('express');
const db = require('../database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

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

// Setup multer for status media
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/status';
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit for videos
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'));
    }
  }
});

// Get all active status
router.get('/', authenticate, (req, res) => {
  try {
    const allStatus = db.getAllStatus();
    res.status(200).json({
      success: true,
      count: allStatus.length,
      data: allStatus,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero status',
    });
  }
});

// Get user's status
router.get('/my-status', authenticate, (req, res) => {
  try {
    const status = db.getUserStatus(req.userId);
    res.status(200).json({
      success: true,
      count: status.length,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero status',
    });
  }
});

// Create status
router.post('/', authenticate, upload.single('media'), (req, res) => {
  try {
    const { caption, duration } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Media file obbligatorio',
      });
    }

    const mediaUrl = `/uploads/status/${req.file.filename}`;
    const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

    const statusId = db.createStatus(
      req.userId,
      mediaType,
      mediaUrl,
      caption || '',
      duration ? parseInt(duration) : 24
    );

    const status = {
      id: statusId,
      userId: req.userId,
      mediaType,
      mediaUrl,
      caption: caption || '',
      duration: duration ? parseInt(duration) : 24,
      createdAt: new Date().toISOString(),
      viewCount: 0
    };

    // Emit to socket
    if (req.app.io) {
      req.app.io.emit('status:created', status);
    }

    res.status(201).json({
      success: true,
      data: status,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione status',
    });
  }
});

// Delete status
router.delete('/:id', authenticate, (req, res) => {
  try {
    const status = db.getUserStatus(req.userId).find(s => s.id === parseInt(req.params.id));
    
    if (!status) {
      return res.status(404).json({
        success: false,
        message: 'Status non trovato o non autorizzato',
      });
    }

    db.deleteStatus(req.params.id);

    // Delete media file
    const filePath = path.join(__dirname, '..', status.mediaUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Emit to socket
    if (req.app.io) {
      req.app.io.emit('status:deleted', { statusId: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: 'Status eliminato con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione status',
    });
  }
});

// View status
router.post('/:id/view', authenticate, (req, res) => {
  try {
    db.viewStatus(req.params.id, req.userId);

    // Emit to socket (notify status owner)
    if (req.app.io) {
      const allStatus = db.getAllStatus();
      const status = allStatus.find(s => s.id === parseInt(req.params.id));
      if (status) {
        const viewer = db.getUserById(req.userId);
        req.app.io.to(`user:${status.userId}`).emit('status:viewed', {
          statusId: req.params.id,
          viewer
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Status visualizzato',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella visualizzazione status',
    });
  }
});

// Get status views
router.get('/:id/views', authenticate, (req, res) => {
  try {
    const allStatus = db.getAllStatus();
    const status = allStatus.find(s => s.id === parseInt(req.params.id));
    
    if (!status || status.userId !== req.userId) {
      return res.status(404).json({
        success: false,
        message: 'Status non trovato o non autorizzato',
      });
    }

    const views = db.getStatusViews(req.params.id);
    res.status(200).json({
      success: true,
      count: views.length,
      data: views,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero visualizzazioni',
    });
  }
});

module.exports = router;

