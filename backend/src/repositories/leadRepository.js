const { pool } = require('../config/mysql');
const { randomUUID } = require('node:crypto');

const leadRepository = {
  async upsertByUser(data) {
    const [rows] = await pool.query('SELECT id, lead_no, lead_score FROM leads WHERE user_open_id = ? LIMIT 1', [data.userOpenId]);
    if (rows.length) {
      const existing = rows[0];
      await pool.query(`
        UPDATE leads
        SET lead_score = ?, lead_status = ?, intent = ?, assigned_agent = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [data.leadScore, data.leadStatus, data.intent, data.assignedAgent, data.notes, existing.id]);
      return existing.lead_no;
    }

    const leadNo = `LD-${randomUUID().slice(0, 10)}`;
    await pool.query(`
      INSERT INTO leads (lead_no, user_open_id, room_id, source_event_id, lead_status, lead_score, intent, assigned_agent, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [leadNo, data.userOpenId, data.roomId, data.sourceEventId, data.leadStatus, data.leadScore, data.intent, data.assignedAgent, data.notes]);
    return leadNo;
  },

  async listRecent() {
    const [rows] = await pool.query(`
      SELECT lead_no, user_open_id, room_id, lead_status, lead_score, intent, assigned_agent, notes, updated_at
      FROM leads
      ORDER BY updated_at DESC
      LIMIT 50
    `);
    return rows;
  }
};

module.exports = { leadRepository };

