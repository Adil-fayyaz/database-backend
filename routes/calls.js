const express = require('express');
const db = process.env.DATABASE_URL 
  ? require('../database-postgres')
  : require('../database');

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

// Get all calls (for admin)
router.get('/', authenticate, (req, res) => {
  try {
    const calls = db.getAllCalls();
    res.status(200).json({
      success: true,
      count: calls.length,
      data: calls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero chiamate',
    });
  }
});

// Get user's calls
router.get('/my-calls', authenticate, (req, res) => {
  try {
    const calls = db.getUserCalls(req.userId);
    res.status(200).json({
      success: true,
      count: calls.length,
      data: calls,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero chiamate',
    });
  }
});

// Initiate call (handled via WebSocket, this is for history)
router.post('/', authenticate, (req, res) => {
  try {
    const { receiverId, groupId, callType } = req.body;

    if (!callType || (callType !== 'voice' && callType !== 'video')) {
      return res.status(400).json({
        success: false,
        message: 'callType deve essere "voice" o "video"',
      });
    }

    if (!receiverId && !groupId) {
      return res.status(400).json({
        success: false,
        message: 'receiverId o groupId obbligatorio',
      });
    }

    const callId = db.createCall(req.userId, receiverId, groupId, callType);

    const callData = {
      id: callId,
      callerId: req.userId,
      receiverId: receiverId || null,
      groupId: groupId || null,
      callType,
      status: 'calling',
      startTime: new Date().toISOString()
    };

    // Emit to socket for real-time signaling
    if (req.app.io) {
      if (receiverId) {
        // Direct call
        const caller = db.getUserById(req.userId);
        req.app.io.to(`user:${receiverId}`).emit('call:incoming', {
          ...callData,
          caller
        });
      } else if (groupId) {
        // Group call
        const caller = db.getUserById(req.userId);
        req.app.io.to(`group:${groupId}`).emit('call:incoming', {
          ...callData,
          caller
        });
      }
    }

    res.status(201).json({
      success: true,
      data: callData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'avvio chiamata',
    });
  }
});

// Update call status
router.put('/:id/status', authenticate, (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status obbligatorio',
      });
    }

    db.updateCallStatus(req.params.id, status);

    // Emit to socket
    if (req.app.io) {
      req.app.io.emit('call:status_changed', {
        callId: req.params.id,
        status
      });
    }

    res.status(200).json({
      success: true,
      message: 'Status chiamata aggiornato',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'aggiornamento status',
    });
  }
});

// End call
router.post('/:id/end', authenticate, (req, res) => {
  try {
    const { duration } = req.body;

    db.endCall(req.params.id, duration || 0);

    // Emit to socket
    if (req.app.io) {
      req.app.io.emit('call:ended', {
        callId: req.params.id,
        duration: duration || 0
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chiamata terminata',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nella terminazione chiamata',
    });
  }
});

module.exports = router;

