const { leadRepository } = require('../repositories/leadRepository');

const leadService = {
  async syncLead({ eventId, roomId, userOpenId, assignedAgent, intent, leadScore, reply }) {
    const leadStatus = leadScore >= 70 ? 'hot' : leadScore >= 40 ? 'warm' : 'new';
    return leadRepository.upsertByUser({
      roomId,
      userOpenId,
      sourceEventId: eventId,
      leadStatus,
      leadScore,
      intent,
      assignedAgent,
      notes: reply
    });
  }
};

module.exports = { leadService };
