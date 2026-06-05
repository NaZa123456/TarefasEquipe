const taskRepository = require("../repositories/task.repository");

async function getTasks(filters) {
  return taskRepository.findAll(filters);
}

async function getTask(id) {
  const task = await taskRepository.findById(id);
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  return task;
}

async function createTask(data) {
  return taskRepository.create(data);
}

async function updateTask(id, data) {
  const task = await taskRepository.findById(id);
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  return taskRepository.update(id, data);
}

async function deleteTask(id) {
  const task = await taskRepository.findById(id);
  if (!task) {
    const err = new Error("Task not found");
    err.status = 404;
    throw err;
  }
  return taskRepository.remove(id);
}

async function getStats(teamId) {
  return taskRepository.getStats(teamId);
}

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, getStats };
