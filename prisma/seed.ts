import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Note: In a real app, you'd get the user ID from Supabase Auth
  // For seeding purposes, we'll use a demo user ID
  const demoUserId = "demo-user-id"

  // Create a sample project
  const project = await prisma.project.upsert({
    where: { id: "demo-project" },
    update: {},
    create: {
      id: "demo-project",
      name: "Demo Project",
      description: "A sample project to get started",
      userId: demoUserId,
    },
  })

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.upsert({
      where: { id: "task-1" },
      update: {},
      create: {
        id: "task-1",
        title: "Set up project structure",
        description: "Initialize the basic project structure",
        status: "DONE",
        priority: "HIGH",
        projectId: project.id,
        assigneeId: demoUserId,
      },
    }),
    prisma.task.upsert({
      where: { id: "task-2" },
      update: {},
      create: {
        id: "task-2",
        title: "Configure authentication",
        description: "Set up Supabase authentication",
        status: "IN_PROGRESS",
        priority: "HIGH",
        projectId: project.id,
        assigneeId: demoUserId,
      },
    }),
    prisma.task.upsert({
      where: { id: "task-3" },
      update: {},
      create: {
        id: "task-3",
        title: "Add database models",
        description: "Create Prisma schema and models",
        status: "TODO",
        priority: "MEDIUM",
        projectId: project.id,
      },
    }),
  ])

  console.log("✅ Database seeded successfully!")
  console.log(`Created project: ${project.name}`)
  console.log(`Created ${tasks.length} tasks`)
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 