fastify.get("/leaderboard", async (req, reply) => {
    const leaderboard = await prisma.student.findMany({
      orderBy: { points: "desc" },
      select: { id: true, name: true, points: true },
      take: 10, // Top 10 students
    });
    reply.send(leaderboard);
  });
  