const express = require('express');
const Database = require('../database');

const router = express.Router();
const db = new Database();

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

router.post('/', authenticate, (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID e content sono obbligatori',
      });
    }

    const messageId = db.createMessage(req.userId, receiverId, content);
    const message = db.getMessageById(messageId);

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
