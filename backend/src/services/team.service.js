const teamRepository = require("../repositories/team.repository");

async function getTeams(userId) {
  return teamRepository.findAll(userId);
}

async function getTeam(id) {
  const team = await teamRepository.findById(id);
  if (!team) {
    const err = new Error("Team not found");
    err.status = 404;
    throw err;
  }
  return team;
}

async function createTeam(data, userId) {
  const team = await teamRepository.create({
    name: data.name,
    description: data.description || "",
    members: { create: { userId } },
  });
  return team;
}

async function updateTeam(id, data) {
  const team = await teamRepository.findById(id);
  if (!team) {
    const err = new Error("Team not found");
    err.status = 404;
    throw err;
  }
  return teamRepository.update(id, { name: data.name, description: data.description });
}

async function deleteTeam(id) {
  const team = await teamRepository.findById(id);
  if (!team) {
    const err = new Error("Team not found");
    err.status = 404;
    throw err;
  }
  return teamRepository.remove(id);
}

async function addMemberToTeam(teamId, userId) {
  return teamRepository.addMember(teamId, userId);
}

async function removeMemberFromTeam(teamId, userId) {
  return teamRepository.removeMember(teamId, userId);
}

module.exports = { getTeams, getTeam, createTeam, updateTeam, deleteTeam, addMemberToTeam, removeMemberFromTeam };
