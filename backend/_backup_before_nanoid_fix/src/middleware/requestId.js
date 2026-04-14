const { nanoid } = require("nanoid");

function requestIdMiddleware(req, res, next) {
  req.requestId = req.headers["x-request-id"] || nanoid(12);
  res.setHeader("x-request-id", req.requestId);
  next();
}

module.exports = { requestIdMiddleware };

