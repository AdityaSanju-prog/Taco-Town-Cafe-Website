const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'chachu_cafe_super_secret_2024';
const inMemoryUsers = new Map();

// Middleware to verify user token
const verifyUserToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized, token missing' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Register user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let newUserObj = null;

    try {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const dbUser = await User.create({
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: 'user',
      });

      newUserObj = {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        phone: dbUser.phone,
        role: dbUser.role,
      };
    } catch (dbErr) {
      if (inMemoryUsers.has(cleanEmail)) {
        return res.status(400).json({ success: false, message: 'An account with this email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const memUser = {
        id: `mem_usr_${Date.now()}`,
        name,
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: 'user',
      };
      inMemoryUsers.set(cleanEmail, memUser);
      newUserObj = {
        id: memUser.id,
        name: memUser.name,
        email: memUser.email,
        phone: memUser.phone,
        role: memUser.role,
      };
    }

    const token = jwt.sign(
      { id: newUserObj.id, email: newUserObj.email, name: newUserObj.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: newUserObj,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user account' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let foundUser = null;

    try {
      foundUser = await User.findOne({ email: cleanEmail });
    } catch {
      // fallback
    }

    if (!foundUser) {
      foundUser = inMemoryUsers.get(cleanEmail);
    }

    if (!foundUser) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const userId = foundUser._id || foundUser.id;
    const token = jwt.sign(
      { id: userId, email: foundUser.email, name: foundUser.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: userId,
        name: foundUser.name,
        email: foundUser.email,
        phone: foundUser.phone,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// Get profile
router.get('/me', verifyUserToken, async (req, res) => {
  try {
    let user = null;
    try {
      user = await User.findById(req.user.id).select('-password');
    } catch {
      // fallback
    }
    if (!user) {
      for (const u of inMemoryUsers.values()) {
        if (u.id === req.user.id || u.email === req.user.email) {
          user = { id: u.id, name: u.name, email: u.email, phone: u.phone, role: u.role };
          break;
        }
      }
    }
    if (!user) {
      user = { id: req.user.id, name: req.user.name, email: req.user.email, role: 'user' };
    }
    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
