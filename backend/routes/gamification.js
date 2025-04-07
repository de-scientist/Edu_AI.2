import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";

export default async function gamificationRoutes(fastify, options) {
  fastify.post("/api/earn-points", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId, points } = request.body;

      await prisma.student.update({
        where: { id: studentId },
        data: { points: { increment: points } },
      });

      return reply.send({ message: "Points added!" });
    } catch (error) {
      console.error("Error adding points:", error);
      return reply.status(500).send({ error: "Failed to add points" });
    }
  });

  fastify.get("/api/leaderboard", { preHandler: authenticate }, async (request, reply) => {
    try {
      const leaderboard = await prisma.student.findMany({
        orderBy: { points: "desc" },
        take: 10,
      });

      return reply.send(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      return reply.status(500).send({ error: "Failed to fetch leaderboard" });
    }
  });
}
