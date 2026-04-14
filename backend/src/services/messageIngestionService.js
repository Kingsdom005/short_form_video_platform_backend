const { randomUUID } = require("node:crypto");
const { redis } = require("../config/redis");
const { eventRepository } = require("../repositories/eventRepository");
const { triageQueue } = require("../queues");

const messageIngestionService = {
  async ingest(payload) {
    const eventId = `EV-${randomUUID().slice(0, 12)}`;
    const idempotencyKey = `${payload.roomId}:${payload.sessionId}:${payload.userOpenId}:${Buffer.from(payload.message).toString("base64").slice(0, 24)}`;
    const dedupeKey = `dedupe:${idempotencyKey}`;

    const ok = await redis.set(dedupeKey, eventId, "EX", 120, "NX");
    if (!ok) {
      return {
        duplicate: true,
        eventId: await redis.get(dedupeKey),
        queueJobId: null,
      };
    }

    await eventRepository.create({
      eventId,
      idempotencyKey,
      roomId: payload.roomId,
      sessionId: payload.sessionId,
      userOpenId: payload.userOpenId,
      nickname: payload.nickname,
      sourceType: payload.sourceType,
      message: payload.message,
      normalizedText: payload.message.trim().toLowerCase(),
      extra: {},
    });

    const qpsKey = `metrics:room:${payload.roomId}:qps`;
    const qps = await redis.incr(qpsKey);
    if (qps === 1) {
      await redis.expire(qpsKey, 5);
    }

    const job = await triageQueue.add(
      "triage-live-message",
      {
        eventId,
        ...payload,
      },
      {
        attempts: 3,
        backoff: { type: "exponential", delay: 2000 },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      },
    );

    return {
      duplicate: false,
      eventId,
      queueJobId: job.id,
    };
  },
};

module.exports = { messageIngestionService };
