import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";

export default async function achievementsRoutes(fastify, options) {
  fastify.get("/api/achievements/:studentId", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId } = request.params;
    
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: { achievements: true },
      });
    
      if (!student) {
        return reply.status(404).send({ error: "Student not found" });
      }
    
      return reply.send(student.achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      return reply.status(500).send({ error: "Failed to fetch achievements" });
    }
  });
}
  