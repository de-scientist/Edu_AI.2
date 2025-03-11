const fastify = require("fastify")();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

fastify.post("/earn-points", async (req, reply) => {
  const { studentId, points } = req.body;

  await prisma.student.update({
    where: { id: studentId },
    data: { points: { increment: points } },
  });

  reply.send({ message: "Points added!" });
});

fastify.get("/leaderboard", async (req, reply) => {
  const leaderboard = await prisma.student.findMany({
    orderBy: { points: "desc" },
    take: 10,
  });

  reply.send(leaderboard);
});
