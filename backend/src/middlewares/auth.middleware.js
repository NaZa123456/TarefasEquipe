const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function authenticate(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    const err = new Error("Authentication required");
    err.status = 401;
    return next(err);
  }

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    const err = new Error("Invalid or expired token");
    err.status = 401;
    next(err);
  }
}

module.exports = { authenticate };
