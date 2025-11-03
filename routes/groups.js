const express = require('express');
const db = process.env.DATABASE_URL 
  ? require('../database-postgres')
  : require('../database');
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

// Setup multer for group avatars
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/groups';
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimeType);
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Get all groups (for admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const groups = await db.getAllGroups();
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    console.error('❌ Errore recupero gruppi:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero gruppi',
    });
  }
});

// Get user's groups
router.get('/my', authenticate, async (req, res) => {
  try {
    const groups = await db.getUserGroups(req.userId);
    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    console.error('❌ Errore recupero gruppi:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero gruppi',
    });
  }
});

// Get group by ID
router.get('/:id', authenticate, (req, res) => {
  try {
    const group = db.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato',
      });
    }
    
    // Check if user is member
    if (!db.isGroupMember(req.params.id, req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Non sei membro di questo gruppo',
      });
    }

    const members = db.getGroupMembers(req.params.id);
    res.status(200).json({
      success: true,
      data: { ...group, members },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero gruppo',
    });
  }
});

// Create group
router.post('/', authenticate, upload.single('avatar'), async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Nome gruppo obbligatorio',
      });
    }

    const avatar = req.file ? `/uploads/groups/${req.file.filename}` : null;
    const group = await db.createGroup(name, description, req.userId);
    await db.addGroupMember(group.id, req.userId);

    // Emit to socket
    if (req.app.io) {
      req.app.io.emit('group:created', group);
    }

    res.status(201).json({
      success: true,
      data: group,
    });
  } catch (error) {
    console.error('❌ Errore creazione gruppo:', error);
    res.status(500).json({
      success: false,
      message: 'Errore nella creazione gruppo',
    });
  }
});

// Update group
router.put('/:id', authenticate, upload.single('avatar'), (req, res) => {
  try {
    const { name, description } = req.body;
    const group = db.getGroupById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato',
      });
    }

    // Check if user is admin
    const members = db.getGroupMembers(req.params.id);
    const userMember = members.find(m => m.userId === req.userId);
    if (!userMember || userMember.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo gli admin possono modificare il gruppo',
      });
    }

    const avatar = req.file ? `/uploads/groups/${req.file.filename}` : group.avatar;
    db.updateGroup(req.params.id, name, description, avatar);
    const updatedGroup = db.getGroupById(req.params.id);

    // Emit to socket
    if (req.app.io) {
      req.app.io.to(`group:${req.params.id}`).emit('group:updated', updatedGroup);
    }

    res.status(200).json({
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento gruppo',
    });
  }
});

// Delete group
router.delete('/:id', authenticate, (req, res) => {
  try {
    const group = db.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato',
      });
    }

    // Only creator can delete
    if (group.createdBy !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Solo il creatore può eliminare il gruppo',
      });
    }

    db.deleteGroup(req.params.id);

    // Emit to socket
    if (req.app.io) {
      req.app.io.to(`group:${req.params.id}`).emit('group:deleted', { groupId: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: 'Gruppo eliminato con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione gruppo',
    });
  }
});

// Add member to group
router.post('/:id/members', authenticate, (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID obbligatorio',
      });
    }

    const group = db.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato',
      });
    }

    // Check if requester is admin
    const members = db.getGroupMembers(req.params.id);
    const userMember = members.find(m => m.userId === req.userId);
    if (!userMember || userMember.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo gli admin possono aggiungere membri',
      });
    }

    db.addGroupMember(req.params.id, userId);

    // Emit to socket
    if (req.app.io) {
      const newMember = db.getUserById(userId);
      req.app.io.to(`group:${req.params.id}`).emit('group:member_added', {
        groupId: req.params.id,
        member: newMember
      });
      req.app.io.to(`user:${userId}`).emit('group:joined', group);
    }

    res.status(200).json({
      success: true,
      message: 'Membro aggiunto con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiunta membro',
    });
  }
});

// Remove member from group
router.delete('/:id/members/:userId', authenticate, (req, res) => {
  try {
    const group = db.getGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Gruppo non trovato',
      });
    }

    // Check if requester is admin or removing themselves
    const members = db.getGroupMembers(req.params.id);
    const userMember = members.find(m => m.userId === req.userId);
    const isAdmin = userMember && userMember.role === 'admin';
    const isSelf = req.userId === parseInt(req.params.userId);

    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        success: false,
        message: 'Non autorizzato',
      });
    }

    db.removeGroupMember(req.params.id, req.params.userId);

    // Emit to socket
    if (req.app.io) {
      req.app.io.to(`group:${req.params.id}`).emit('group:member_removed', {
        groupId: req.params.id,
        userId: req.params.userId
      });
      req.app.io.to(`user:${req.params.userId}`).emit('group:left', { groupId: req.params.id });
    }

    res.status(200).json({
      success: true,
      message: 'Membro rimosso con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella rimozione membro',
    });
  }
});

// Get group messages
router.get('/:id/messages', authenticate, (req, res) => {
  try {
    // Check if user is member
    if (!db.isGroupMember(req.params.id, req.userId)) {
      return res.status(403).json({
        success: false,
        message: 'Non sei membro di questo gruppo',
      });
    }

    const messages = db.getGroupMessages(req.params.id);
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

module.exports = router;

