const { pool } = require('../config/mysql');

const knowledgeRepository = {
  async findEnabledByCategory(category) {
    const [rows] = await pool.query(`
      SELECT item_key, title, content
      FROM knowledge_items
      WHERE category = ? AND enabled = 1
      ORDER BY updated_at DESC
    `, [category]);
    return rows;
  }
};

module.exports = { knowledgeRepository };
