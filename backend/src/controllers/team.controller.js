const teamService = require("../services/team.service");

async function getTeams(req, res, next) {
  try {
    const teams = await teamService.getTeams(req.user.id);
    res.json(teams);
  } catch (err) {
    next(err);
  }
}

async function createTeam(req, res, next) {
  try {
    const team = await teamService.createTeam(req.body, req.user.id);
    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
}

async function updateTeam(req, res, next) {
  try {
    const team = await teamService.updateTeam(Number(req.params.id), req.body);
    res.json(team);
  } catch (err) {
    next(err);
  }
}

async function deleteTeam(req, res, next) {
  try {
    await teamService.deleteTeam(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function addMember(req, res, next) {
  try {
    const result = await teamService.addMemberToTeam(Number(req.params.id), Number(req.body.userId));
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function removeMember(req, res, next) {
  try {
    await teamService.removeMemberFromTeam(Number(req.params.id), Number(req.params.userId));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getTeams, createTeam, updateTeam, deleteTeam, addMember, removeMember };
