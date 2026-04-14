const IORedis = require('ioredis');
const env = require('./env');

const redis = new IORedis({
  host: env.redis.host,
  port: env.redis.port,
  maxRetriesPerRequest: null
});

module.exports = { redis };
