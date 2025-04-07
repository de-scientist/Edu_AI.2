import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function studyPlannerRoutes(fastify, options) {
  fastify.post("/api/generate-study-plan", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId, studyHours } = request.body;
      const performance = await prisma.studentPerformance.findMany({ where: { studentId } });

      const weakTopics = performance.filter((p) => p.score < 50).map((p) => p.topic);
      if (weakTopics.length === 0) {
        return reply.send({ message: "🎉 No weak areas!" });
      }

      const response = await openai.completions.create({
        model: "gpt-4-turbo",
        prompt: `Generate a ${studyHours}-hour study plan covering these topics: ${weakTopics.join(", ")}`,
        max_tokens: 300,
      });

      const plan = response.choices[0].text.trim().split("\n").map((item) => ({
        studentId,
        topic: item,
        date: new Date(),
      }));

      await prisma.studyPlan.createMany({ data: plan });

      return reply.send({ studyPlan: plan });
    } catch (error) {
      console.error("Error generating study plan:", error);
      return reply.status(500).send({ error: "Failed to generate study plan" });
    }
  });
}
