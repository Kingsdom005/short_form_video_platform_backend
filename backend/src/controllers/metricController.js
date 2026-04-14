const { pool } = require('../config/mysql');
const { redis } = require('../config/redis');

async function getOverviewMetrics(req, res, next) {
  try {
    const [[messageCount]] = await pool.query('SELECT COUNT(*) AS total FROM events');
    const [[leadCount]] = await pool.query('SELECT COUNT(*) AS total FROM leads');
    const roomHotKey = await redis.get('metrics:room:demo-room-001:qps');

    res.json({
      totalMessages: messageCount.total,
      totalLeads: leadCount.total,
      totalRisks: 0, // events table doesn't have risk_level field
      roomQpsApprox: Number(roomHotKey || 0),
      onlineWorkers: Number(process.env.WORKER_COUNT || 2)
    });
  } catch (error) {
    next(error);
  }
}

async function getRecentMessages(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT event_id, nickname, message, created_at
      FROM events
      ORDER BY created_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

module.exports = { getOverviewMetrics, getRecentMessages };
