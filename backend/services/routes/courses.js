import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function courseRoutes(fastify, options) {
  // Get recommended courses for a student
  fastify.get("/courses/recommend/:userId", async (request, reply) => {
    const { userId } = request.params;

    // Fetch user progress
    const progress = await prisma.progress.findMany({
      where: { userId },
      include: { course: true }
    });

    // Simple recommendation logic: suggest courses student hasn’t taken
    const takenCourses = progress.map(p => p.courseId);
    const recommendedCourses = await prisma.course.findMany({
      where: { id: { notIn: takenCourses } },
      take: 5
    });

    return recommendedCourses;
  });
}

fastify.get("/student-progress/:studentId", async (req, reply) => {
  const { studentId } = req.params;
  const performance = await prisma.performance.findMany({ where: { studentId } });
  
  const progress = performance.reduce((acc, p) => {
    acc[p.topic] = p.score;
    return acc;
  }, {});

  reply.send(progress);
});