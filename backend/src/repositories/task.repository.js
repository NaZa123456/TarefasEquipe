const prisma = require("../prisma/client");

async function findAll(filters) {
  const where = {};
  if (filters.teamId) where.teamId = filters.teamId;
  if (filters.status) where.status = filters.status;
  if (filters.priority) where.priority = filters.priority;
  if (filters.assignedUserId) where.assignedUserId = filters.assignedUserId;
  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const skip = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      include: { assignedUser: { select: { id: true, name: true, email: true } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.task.count({ where }),
  ]);

  return { tasks, total, page, totalPages: Math.ceil(total / limit) };
}

async function findById(id) {
  return prisma.task.findUnique({
    where: { id },
    include: { assignedUser: { select: { id: true, name: true, email: true } } },
  });
}

async function create(data) {
  return prisma.task.create({
    data,
    include: { assignedUser: { select: { id: true, name: true, email: true } } },
  });
}

async function update(id, data) {
  return prisma.task.update({
    where: { id },
    data,
    include: { assignedUser: { select: { id: true, name: true, email: true } } },
  });
}

async function remove(id) {
  return prisma.task.delete({ where: { id } });
}

async function getStats(teamId) {
  const where = teamId ? { teamId } : {};
  const [total, done, todo, inProgress] = await Promise.all([
    prisma.task.count({ where }),
    prisma.task.count({ where: { ...where, status: "done" } }),
    prisma.task.count({ where: { ...where, status: "todo" } }),
    prisma.task.count({ where: { ...where, status: "in_progress" } }),
  ]);
  return { total, done, todo, inProgress };
}

module.exports = { findAll, findById, create, update, remove, getStats };
