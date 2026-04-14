const { redis } = require('../config/redis');

async function rateLimitMiddleware(req, res, next) {
  try {
    const ip = req.ip || 'unknown';
    const key = `ratelimit:${ip}:${Math.floor(Date.now() / 10000)}`;
    const count = await redis.incr(key);
    if (count === 1) {
      await redis.expire(key, 10);
    }
    if (count > 300) {
      return res.status(429).json({ message: 'Too many requests' });
    }
    next();
  } catch (error) {
    next();
  }
}

module.exports = { rateLimitMiddleware };
