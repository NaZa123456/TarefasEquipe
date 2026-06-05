const prisma = require("../prisma/client");

async function findAll(userId) {
  return prisma.team.findMany({
    where: { members: { some: { userId } } },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } }, _count: { select: { tasks: true } } },
  });
}

async function findById(id) {
  return prisma.team.findUnique({
    where: { id },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } }, _count: { select: { tasks: true } } },
  });
}

async function create(data) {
  return prisma.team.create({ data, include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } });
}

async function update(id, data) {
  return prisma.team.update({ where: { id }, data, include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } } });
}

async function remove(id) {
  return prisma.team.delete({ where: { id } });
}

async function addMember(teamId, userId) {
  return prisma.teamMember.create({ data: { teamId, userId } });
}

async function removeMember(teamId, userId) {
  return prisma.teamMember.delete({ where: { userId_teamId: { userId, teamId } } });
}

module.exports = { findAll, findById, create, update, remove, addMember, removeMember };
