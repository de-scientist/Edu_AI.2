export default async function analyticsRoutes(fastify, options) {
    // Get system analytics
    fastify.get("/admin/analytics", async (request, reply) => {
      const totalUsers = await prisma.user.count();
      const activeUsers = await prisma.progress.count({ where: { progress: { gt: 0 } } });
      const courseCompletions = await prisma.progress.count({ where: { progress: 100 } });
  
      return { totalUsers, activeUsers, courseCompletions };
    });
  }
  