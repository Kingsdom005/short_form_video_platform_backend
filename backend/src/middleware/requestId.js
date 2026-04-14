const { randomUUID } = require("node:crypto");

function requestIdMiddleware(req, res, next) {
  req.requestId = req.headers["x-request-id"] || randomUUID().slice(0, 12);
  res.setHeader("x-request-id", req.requestId);
  next();
}

module.exports = { requestIdMiddleware };
