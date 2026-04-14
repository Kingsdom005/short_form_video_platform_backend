const { Worker } = require('bullmq');
const { connection } = require('../queues');
const env = require('../config/env');
const { runAgents } = require('../services/agentOrchestrator');
const { eventRepository } = require('../repositories/eventRepository');
const { leadService } = require('../services/leadService');

let workerInstance = null;

function createWorker() {
  return new Worker(`${env.queuePrefix}:triage`, async (job) => {
    const result = await runAgents(job.data);

    await eventRepository.updateAfterProcess(job.data.eventId, {
      intent: result.intent,
      riskLevel: result.riskLevel,
      processStatus: 'processed',
      normalizedText: job.data.message.trim().toLowerCase()
    });

    await leadService.syncLead({
      eventId: job.data.eventId,
      roomId: job.data.roomId,
      userOpenId: job.data.userOpenId,
      assignedAgent: result.assignedAgent,
      intent: result.intent,
      leadScore: result.leadScore,
      reply: result.reply
    });

    return result;
  }, {
    connection,
    concurrency: 10
  });
}

function startWorker() {
  if (workerInstance) return workerInstance;
  workerInstance = createWorker();

  workerInstance.on('completed', (job) => {
    console.log(`Job completed: ${job.id}`);
  });

  workerInstance.on('failed', (job, err) => {
    console.error(`Job failed: ${job?.id}`, err);
  });

  return workerInstance;
}

if (require.main === module) {
  startWorker();
  console.log('Agent worker started');
}

module.exports = { startWorker };
