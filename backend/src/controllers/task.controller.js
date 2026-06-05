const taskService = require("../services/task.service");

async function getTasks(req, res, next) {
  try {
    const { teamId, status, priority, assignedUserId, search, page, limit } = req.query;
    const result = await taskService.getTasks({
      teamId: teamId ? Number(teamId) : undefined,
      status,
      priority,
      assignedUserId: assignedUserId ? Number(assignedUserId) : undefined,
      search,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getTask(req, res, next) {
  try {
    const task = await taskService.getTask(Number(req.params.id));
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const task = await taskService.createTask(req.body);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await taskService.updateTask(Number(req.params.id), req.body);
    res.json(task);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    await taskService.deleteTask(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await taskService.getStats(req.query.teamId ? Number(req.query.teamId) : undefined);
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats };
