import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";

export default async function usersRoutes(fastify, options) {
  // Get all users
  fastify.get("/eduai/users", async (request, reply) => {
    try {
      // For now, we'll return all users without authentication
      // In a production environment, you should add authentication
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          // Exclude sensitive information like password
        }
      });
      
      return reply.send(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return reply.status(500).send({ error: "Failed to fetch users" });
    }
  });

  // Get user stats
  fastify.get("/eduai/stats", async (request, reply) => {
    try {
      // Get total students
      const totalStudents = await prisma.user.count({
        where: { role: "STUDENT" }
      });

      // Get total questions (from quizzes)
      const totalQuestions = await prisma.quiz.count();

      // Get total courses
      const totalCourses = await prisma.course.count();

      // Get completed courses (progress = 100)
      const completedCourses = await prisma.progress.count({
        where: { progress: 100 }
      });

      // Calculate average completion rate
      const allProgress = await prisma.progress.findMany();
      const avgCompletionRate = allProgress.length > 0
        ? Math.round(allProgress.reduce((acc, curr) => acc + curr.progress, 0) / allProgress.length)
        : 0;

      const stats = {
        totalStudents,
        totalQuestions,
        avgCompletionRate,
        totalCourses,
        completedCourses
      };
      
      return reply.send(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      return reply.status(500).send({ error: "Failed to fetch stats" });
    }
  });
} 