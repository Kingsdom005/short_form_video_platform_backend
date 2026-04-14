const { Queue } = require('bullmq');
const { redis } = require('../config/redis');
const env = require('../config/env');

const connection = redis.duplicate();

const triageQueue = new Queue(`${env.queuePrefix}-triage`, { connection });
const summaryQueue = new Queue(`${env.queuePrefix}-summary`, { connection });

module.exports = { triageQueue, summaryQueue, connection };
