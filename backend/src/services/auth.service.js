const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * @param {{ name: string, email: string, password: string }} data
 */
async function register(data) {
  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 400;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepository.create({ name: data.name, email: data.email, password: hashedPassword });

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return { user, token };
}

/**
 * @param {{ email: string, password: string }} data
 */
async function login(data) {
  const user = await userRepository.findByEmail(data.email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(data.password, user.password);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
}

module.exports = { register, login };
