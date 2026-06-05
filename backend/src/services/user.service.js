const userRepository = require("../repositories/user.repository");

async function getProfile(userId) {
  const user = await userRepository.findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }
  return user;
}

async function updateProfile(userId, data) {
  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.email) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing && existing.id !== userId) {
      const err = new Error("Email already in use");
      err.status = 400;
      throw err;
    }
    updateData.email = data.email;
  }
  return userRepository.update(userId, updateData);
}

async function listUsers() {
  return userRepository.findAll();
}

module.exports = { getProfile, updateProfile, listUsers };
