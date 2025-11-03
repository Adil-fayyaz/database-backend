const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = process.env.DATABASE_URL 
  ? require('../database-postgres')
  : require('../database');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'private_server_secret_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

router.post('/register', async (req, res) => {
  try {
    const { name, phone, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tutti i campi sono obbligatori',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password deve essere di almeno 6 caratteri',
      });
    }

    // Check if user exists
    const existingUser = await db.getUserByPhone(phone);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Utente già esistente',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.createUser(name, phone, hashedPassword);

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante la registrazione',
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Phone e password sono obbligatori',
      });
    }

    // Get user from database
    const user = await db.getUserByPhone(phone);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide',
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenziali non valide',
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Errore durante il login',
    });
  }
});

router.get('/me', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token non fornito',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'private_server_secret_key');
    const user = db.getUserById(decoded.id);

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
    res.status(401).json({
      success: false,
      message: 'Token non valido',
    });
  }
});

module.exports = router;
