const prisma = require("../src/prisma/client");
const bcrypt = require("bcryptjs");

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@taskflow.com" },
    update: {},
    create: { name: "Admin", email: "admin@taskflow.com", password },
  });

  const team = await prisma.team.upsert({
    where: { id: 1 },
    update: {},
    create: { name: "Engineering", description: "Engineering team" },
  });

  await prisma.teamMember.upsert({
    where: { userId_teamId: { userId: admin.id, teamId: team.id } },
    update: {},
    create: { userId: admin.id, teamId: team.id },
  });

  await prisma.task.create({
    data: {
      title: "Setup CI/CD pipeline",
      description: "Configure GitHub Actions for deployment",
      status: "todo",
      priority: "high",
      teamId: team.id,
      assignedUserId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Write API documentation",
      description: "Document all endpoints with examples",
      status: "in_progress",
      priority: "medium",
      teamId: team.id,
      assignedUserId: admin.id,
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
