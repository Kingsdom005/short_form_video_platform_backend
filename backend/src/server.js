const app = require('./app');
const env = require('./config/env');
const { startWorker } = require('./workers/agent.worker');

const server = app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});

if (process.env.START_INLINE_WORKER === 'true') {
  startWorker();
}

function shutdown(signal) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
