const jwt = require('jsonwebtoken');
const env = require('../config/env');

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header required' });
    }

    const token = authHeader.split(' ')[1]; // Bearer token
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(401).json({ message: 'Authentication failed' });
  }
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
