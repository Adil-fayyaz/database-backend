const express = require('express');
const Database = require('../database');

const router = express.Router();
const db = new Database();

// Simple auth middleware
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
    const users = db.getAllUsers();
    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero utenti',
    });
  }
});

router.get('/:id', authenticate, (req, res) => {
  try {
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato',
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nel recupero utente',
    });
  }
});

router.delete('/:id', authenticate, (req, res) => {
  try {
    const result = db.deleteUser(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Utente non trovato',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Utente eliminato con successo',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Errore nell\'eliminazione utente',
    });
  }
});

module.exports = router;
