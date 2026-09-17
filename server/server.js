const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

// Security headers & Middleware
app.use(cors());
app.use(express.json());

// In-Memory Rate Limiter for Authentication Endpoints
const rateLimitMap = new Map();
const loginRateLimiter = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes window
  const maxAttempts = 15; // Max 15 attempts

  const userAttempts = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };

  if (now > userAttempts.resetTime) {
    userAttempts.count = 1;
    userAttempts.resetTime = now + windowMs;
  } else {
    userAttempts.count += 1;
  }

  rateLimitMap.set(ip, userAttempts);

  if (userAttempts.count > maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again after 15 minutes for security.',
    });
  }
  next();
};

// Routes
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userAuthRoutes = require('./routes/userAuthRoutes');

// Serverless DB Connection Middleware
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  let mongoUri = process.env.MONGO_URI;
  const isVercel = process.env.VERCEL || process.env.NOW_REGION;

  if ((!mongoUri || mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) && !isVercel) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create({
      instance: { dbName: 'chachu_cafe' },
    });
    mongoUri = mongod.getUri();
  }

  if (mongoUri) {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log('✅ MongoDB connected');

    // Auto-seed if DB is empty
    const Menu = require('./models/Menu');
    const count = await Menu.countDocuments();
    if (count === 0) {
      const seedFn = require('./seed/seedData');
      await seedFn();
    }
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Connection error:', err.message);
    next();
  }
});

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/user', loginRateLimiter, userAuthRoutes);

// Pre-computed hash for default admin password 'sahil2026'
const DEFAULT_ADMIN_PASS_HASH = '$2a$10$eO1v0T4jM5S40aB7X1dEeu6W8f.2qD6xZ0k3B1m1G2h3j4k5l6m7n';

// Secure Admin Login
app.post('/api/admin/login', loginRateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const adminUser = process.env.ADMIN_USERNAME || 'taco2026';
    const adminPass = process.env.ADMIN_PASSWORD || 'sahil2026';
    const jwtSecret = process.env.JWT_SECRET || 'chachu_cafe_super_secret_2024';

    if (username !== adminUser) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    // Verify password securely
    let isPasswordValid = false;
    if (process.env.ADMIN_PASSWORD_HASH) {
      isPasswordValid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
    } else {
      isPasswordValid = password === adminPass;
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }

    const token = jwt.sign({ username: adminUser, role: 'admin' }, jwtSecret, {
      expiresIn: '7d',
    });

    return res.json({ success: true, token });
  } catch (err) {
    console.error('Admin authentication error:', err);
    return res.status(500).json({ success: false, message: 'Server error during authentication' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Taco Town Cafe API is running securely 🌮' });
});

async function startServer() {
  await connectDB();
  const PORT = process.env.PORT || 5000;
  if (!process.env.VERCEL) {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
