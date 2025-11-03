const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');

const router = express.Router();

// Create uploads directory
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

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
    const files = db.getAllFiles();
    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero file',
    });
  }
});

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nessun file caricato',
      });
    }

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    // Check if we're using PostgreSQL or SQLite
    if (db.createFile.constructor.name === 'AsyncFunction') {
      // PostgreSQL (async)
      const file = await db.createFile(
        req.userId,
        req.file.filename,
        `/uploads/${req.file.filename}`,
        req.file.mimetype,
        req.file.size
      );
      
      res.status(201).json({
        success: true,
        url: fileUrl,
        data: file,
      });
    } else {
      // SQLite (sync)
      const fileId = db.createFile(
        req.file.filename,
        req.file.originalname,
        `/uploads/${req.file.filename}`,
        req.file.size,
        req.file.mimetype,
        req.userId
      );

      const file = db.getAllFiles().find(f => f.id === fileId);

      res.status(201).json({
        success: true,
        url: fileUrl,
        data: file,
      });
    }
  } catch (error) {
    console.error('❌ Errore upload file:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel caricamento file',
    });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const files = db.getAllFiles();
    const file = files.find(f => f.id === parseInt(req.params.id));
    
    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File non trovato',
      });
    }

    // Delete physical file
    const filePath = path.join(__dirname, '..', file.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    const result = db.deleteFile(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'File eliminato con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione file',
    });
  }
});

module.exports = router;
