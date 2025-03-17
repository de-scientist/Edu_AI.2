//Fetches student performance data
fastify.get("/student-performance", async (req, reply) => {
    const performance = await prisma.studentPerformance.findMany();
    reply.send(performance);
  });
  