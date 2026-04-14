const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const pinoHttp = require("pino-http");
const env = require("./config/env");
const { requestIdMiddleware } = require("./middleware/requestId");
const { rateLimitMiddleware } = require("./middleware/rateLimit");
const { errorHandler } = require("./middleware/errorHandler");

const healthRoutes = require("./routes/healthRoutes");
const eventRoutes = require("./routes/eventRoutes");
const metricRoutes = require("./routes/metricRoutes");
const leadRoutes = require("./routes/leadRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const statsRoutes = require("./routes/statsRoutes");
const userProfileRoutes = require("./routes/userProfileRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const { authMiddleware } = require("./middleware/auth");

const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(
  pinoHttp({
    level: env.nodeEnv === "production" ? "info" : "debug",
    redact: {
      paths: ["req.headers.authorization", "req.body.password"],
      censor: "***",
    },
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        headers: {
          host: req.headers.host,
          "user-agent": req.headers["user-agent"],
          "content-type": req.headers["content-type"],
          "content-length": req.headers["content-length"],
        },
        remoteAddress: req.remoteAddress,
        remotePort: req.remotePort,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
        headers: res.headers,
      }),
      err: (err) => ({
        type: err.type,
        message: err.message,
        stack: env.nodeEnv === "production" ? undefined : err.stack,
      }),
    },
  }),
);
app.use(requestIdMiddleware);
app.use(rateLimitMiddleware);

app.use("/health", healthRoutes);
app.use(`${env.apiPrefix}/auth`, authRoutes);
app.use(`${env.apiPrefix}/users`, authMiddleware, userRoutes);
app.use(`${env.apiPrefix}/roles`, authMiddleware, roleRoutes);
app.use(`${env.apiPrefix}/stats`, authMiddleware, statsRoutes);
app.use(`${env.apiPrefix}/profiles`, authMiddleware, userProfileRoutes);
app.use(
  `${env.apiPrefix}/recommendations`,
  authMiddleware,
  recommendationRoutes,
);
app.use(`${env.apiPrefix}/events`, authMiddleware, eventRoutes);
app.use(`${env.apiPrefix}/metrics`, authMiddleware, metricRoutes);
app.use(`${env.apiPrefix}/leads`, authMiddleware, leadRoutes);

app.use(errorHandler);

module.exports = app;
