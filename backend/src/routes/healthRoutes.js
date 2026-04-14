const router = require('express').Router();
const { pool } = require('../config/mysql');
const { redis } = require('../config/redis');

router.get('/', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    await redis.ping();
    res.json({
      ok: true,
      service: 'douyin-multi-agent-backend',
      mysql: 'ok',
      redis: 'ok',
      time: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
