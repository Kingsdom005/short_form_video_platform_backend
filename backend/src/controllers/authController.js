const { pool } = require('../config/mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

async function register(req, res, next) {
  try {
    const { username, email, password, role = 'user' } = req.body;

    // Validate input format
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // Check if user already exists
    const [existingUsers] = await pool.query('SELECT * FROM backend_user WHERE username = ? OR email = ?', [username, email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    await pool.query(
      'INSERT INTO backend_user (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, role]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    // Find user
    const [users] = await pool.query('SELECT * FROM backend_user WHERE username = ?', [username]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const { userId } = req.user;

    const [users] = await pool.query('SELECT id, username, email, role, created_at FROM backend_user WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(users[0]);
  } catch (error) {
    next(error);
  }
}

async function updatePassword(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // Find user by username and email
    const [users] = await pool.query('SELECT * FROM backend_user WHERE username = ? AND email = ?', [username, email]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found with the provided username and email' });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(password, 10);

    // Update password
    await pool.query('UPDATE backend_user SET password_hash = ? WHERE id = ?', [passwordHash, users[0].id]);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getCurrentUser, updatePassword };
