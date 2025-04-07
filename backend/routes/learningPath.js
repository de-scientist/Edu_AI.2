import prisma from "../prisma/db.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";
import cache from "../lib/cache.js";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function learningPathRoutes(fastify, options) {
  // Get personalized learning path for a student
  fastify.get("/api/student/learning-path", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId } = request.query;
      
      if (!studentId) {
        return reply.status(400).send({ error: "Student ID is required" });
      }
      
      // Check if cached
      const cachedPath = await cache.get(`learningPath:${studentId}`);
      if (cachedPath) return reply.send(JSON.parse(cachedPath));
      
      // Get student's current progress and performance
      const progress = await prisma.progress.findMany({
        where: { userId: studentId },
        include: {
          course: true,
          module: true,
          quiz: true
        }
      });
      
      // Get student's performance in quizzes
      const performance = await prisma.performance.findMany({
        where: { userId: studentId },
        include: {
          quiz: true,
          module: true
        }
      });
      
      // Identify weak areas
      const weakAreas = performance
        .filter(p => p.score < 70)
        .map(p => ({
          topic: p.module.name,
          score: p.score,
          moduleId: p.moduleId
        }));
      
      // Generate personalized learning path using OpenAI
      const prompt = `Based on the student's performance in these areas: ${weakAreas.map(w => `${w.topic} (${w.score}%)`).join(", ")}, 
        suggest a personalized learning path. Include:
        1. Recommended modules to focus on
        2. Estimated time for each module
        3. Prerequisites for each module
        4. Learning resources for each topic
        Format the response as a JSON object.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const learningPath = JSON.parse(response.choices[0].message.content);
      
      // Add current progress to the learning path
      learningPath.currentProgress = progress.map(p => ({
        courseId: p.courseId,
        courseName: p.course.name,
        progress: p.progress,
        lastAccessed: p.updatedAt
      }));
      
      // Cache the result for 1 hour
      await cache.setex(`learningPath:${studentId}`, 3600, JSON.stringify(learningPath));
      
      return reply.send(learningPath);
    } catch (error) {
      console.error("Error generating learning path:", error);
      return reply.status(500).send({ error: "Failed to generate learning path" });
    }
  });
  
  // Update learning path progress
  fastify.post("/api/student/learning-path/progress", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId, moduleId, progress } = request.body;
      
      if (!studentId || !moduleId || progress === undefined) {
        return reply.status(400).send({ error: "Missing required fields" });
      }
      
      const result = await prisma.learningPathProgress.upsert({
        where: {
          userId_moduleId: {
            userId: studentId,
            moduleId: moduleId
          }
        },
        update: {
          progress: progress,
          updatedAt: new Date()
        },
        create: {
          userId: studentId,
          moduleId: moduleId,
          progress: progress
        }
      });
      
      // Invalidate cache
      await cache.del(`learningPath:${studentId}`);
      
      return reply.send(result);
    } catch (error) {
      console.error("Error updating learning path progress:", error);
      return reply.status(500).send({ error: "Failed to update learning path progress" });
    }
  });
}
