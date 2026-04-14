const { leadRepository } = require('../repositories/leadRepository');

async function listLeads(req, res, next) {
  try {
    const rows = await leadRepository.listRecent();
    res.json(rows);
  } catch (error) {
    next(error);
  }
}

module.exports = { listLeads };
