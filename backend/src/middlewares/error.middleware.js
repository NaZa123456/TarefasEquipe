/**
 * Global error handling middleware
 */
function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  if (process.env.NODE_ENV !== "test") {
    console.error(`[Error] ${status} - ${message}`);
  }

  res.status(status).json({ error: message });
}

module.exports = errorHandler;
