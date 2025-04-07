import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";

export default async function progressRoutes(fastify, options) {
  // Get progress for a specific student
  fastify.get("/api/student/progress", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId } = request.query;
      
      if (!studentId) {
        return reply.status(400).send({ error: "Student ID is required" });
      }
      
      const progress = await prisma.progress.findMany({
        where: { userId: studentId },
        include: { 
          course: true,
          module: true,
          quiz: true
        }
      });
      
      return reply.send(progress);
    } catch (error) {
      console.error("Error fetching student progress:", error);
      return reply.status(500).send({ error: "Failed to fetch student progress" });
    }
  });
  
  // Get weekly progress for a student
  fastify.get("/api/student/weekly-progress", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId } = request.query;
      
      if (!studentId) {
        return reply.status(400).send({ error: "Student ID is required" });
      }
      
      // Get progress for the last 4 weeks
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      
      const weeklyProgress = await prisma.progress.findMany({
        where: { 
          userId: studentId,
          createdAt: { gte: fourWeeksAgo }
        },
        orderBy: { createdAt: 'asc' },
        include: {
          course: true,
          module: true
        }
      });
      
      // Group by week
      const groupedProgress = weeklyProgress.reduce((acc, curr) => {
        const week = new Date(curr.createdAt).toISOString().split('T')[0].slice(0, 7);
        if (!acc[week]) {
          acc[week] = [];
        }
        acc[week].push(curr);
        return acc;
      }, {});
      
      // Calculate average progress per week
      const result = Object.entries(groupedProgress).map(([week, entries]) => {
        const avgProgress = entries.reduce((sum, entry) => sum + entry.progress, 0) / entries.length;
        return { 
          week, 
          progress: avgProgress,
          courses: entries.map(entry => ({
            courseId: entry.courseId,
            courseName: entry.course.name,
            progress: entry.progress
          }))
        };
      });
      
      return reply.send({ weeklyProgress: result });
    } catch (error) {
      console.error("Error fetching weekly progress:", error);
      return reply.status(500).send({ error: "Failed to fetch weekly progress" });
    }
  });
  
  // Update a user's course progress
  fastify.post("/api/student/progress/update", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId, courseId, moduleId, progress, quizId } = request.body;
      
      if (!userId || !courseId || progress === undefined) {
        return reply.status(400).send({ error: "Missing required fields" });
      }
      
      // Ensure progress doesn't exceed 100%
      const updatedProgress = progress > 100 ? 100 : progress;
      
      const result = await prisma.progress.upsert({
        where: { 
          userId_courseId: { 
            userId, 
            courseId 
          }
        },
        update: { 
          progress: updatedProgress,
          updatedAt: new Date(),
          moduleId: moduleId || undefined,
          quizId: quizId || undefined
        },
        create: { 
          userId, 
          courseId, 
          progress: updatedProgress,
          moduleId: moduleId || null,
          quizId: quizId || null,
          week: new Date().getDay() === 0 ? 1 : Math.ceil(new Date().getDate() / 7),
          past_progress: 0
        },
        include: {
          course: true,
          module: true,
          quiz: true
        }
      });
      
      return reply.send(result);
    } catch (error) {
      console.error("Error updating progress:", error);
      return reply.status(500).send({ error: "Failed to update progress" });
    }
  });
  
  // Get detailed progress for a specific module
  fastify.get("/api/student/module-progress", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId, moduleId } = request.query;
      
      if (!studentId || !moduleId) {
        return reply.status(400).send({ error: "Student ID and Module ID are required" });
      }
      
      const moduleProgress = await prisma.progress.findMany({
        where: { 
          userId: studentId,
          moduleId: moduleId
        },
        include: {
          module: true,
          quiz: true
        }
      });
      
      return reply.send(moduleProgress);
    } catch (error) {
      console.error("Error fetching module progress:", error);
      return reply.status(500).send({ error: "Failed to fetch module progress" });
    }
  });
}
  