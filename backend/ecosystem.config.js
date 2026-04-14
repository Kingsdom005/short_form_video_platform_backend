module.exports = {
  apps: [
    {
      name: 'douyin-api',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    },
    {
      name: 'douyin-worker',
      script: './src/workers/agent.worker.js',
      instances: 2,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
