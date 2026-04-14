const { pool } = require('../config/mysql');

const eventRepository = {
  async create(data) {
    const sql = `
      INSERT INTO event_messages (
        event_id, idempotency_key, room_id, session_id, user_open_id, nickname,
        source_type, message_text, normalized_text, process_status, extra_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [
      data.eventId,
      data.idempotencyKey,
      data.roomId,
      data.sessionId,
      data.userOpenId,
      data.nickname,
      data.sourceType,
      data.message,
      data.normalizedText,
      'queued',
      JSON.stringify(data.extra || {})
    ]);
  },

  async updateAfterProcess(eventId, patch) {
    const sql = `
      UPDATE event_messages
      SET intent = ?, risk_level = ?, process_status = ?, normalized_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE event_id = ?
    `;
    await pool.query(sql, [
      patch.intent,
      patch.riskLevel,
      patch.processStatus,
      patch.normalizedText,
      eventId
    ]);
  }
};

module.exports = { eventRepository };
