require("dotenv").config();

module.exports = {
  port: Number(process.env.PORT || 3000),
  nodeEnv: process.env.NODE_ENV || "development",
  mysql: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "lyq146411",
    database: process.env.MYSQL_DATABASE || "douyin_agent",
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
  },
  apiPrefix: process.env.API_PREFIX || "/api",
  queuePrefix: process.env.QUEUE_PREFIX || "douyin-agent",
  defaultRoomId: process.env.DEFAULT_ROOM_ID || "demo-room-001",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
};
