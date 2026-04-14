const { z } = require('zod');
const { messageIngestionService } = require('../services/messageIngestionService');

const schema = z.object({
  roomId: z.string().min(1),
  sessionId: z.string().min(1),
  userOpenId: z.string().min(1),
  nickname: z.string().optional().default('guest'),
  message: z.string().min(1).max(1000),
  sourceType: z.string().optional().default('live_message')
});

async function ingestLiveMessage(req, res, next) {
  try {
    const payload = schema.parse(req.body);
    const result = await messageIngestionService.ingest(payload);
    res.status(result.duplicate ? 200 : 202).json({
      accepted: true,
      duplicate: result.duplicate,
      eventId: result.eventId,
      queueJobId: result.queueJobId,
      requestId: req.requestId
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { ingestLiveMessage };
