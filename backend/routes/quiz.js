import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function quizRoutes(fastify, options) {
  fastify.post("/api/check-answer", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { questionId, studentAnswer } = request.body;
      const question = await prisma.question.findUnique({ where: { id: questionId } });

      if (!question) {
        return reply.status(404).send({ error: "Question not found" });
      }

      if (studentAnswer === question.answer) {
        return reply.send({ correct: true, message: "✅ Correct!" });
      }

      const response = await openai.completions.create({
        model: "gpt-4-turbo",
        prompt: `The student answered incorrectly.\n\nQuestion: ${question.text}\nCorrect Answer: ${question.answer}\nStudent Answer: ${studentAnswer}\n\nProvide an explanation:`,
        max_tokens: 150,
      });

      return reply.send({ correct: false, message: response.choices[0].text.trim() });
    } catch (error) {
      console.error("Error checking answer:", error);
      return reply.status(500).send({ error: "Failed to check answer" });
    }
  });

  fastify.post("/api/generate-quiz", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { studentId } = request.body;
      const performance = await prisma.studentPerformance.findMany({ where: { studentId } });

      const weakTopics = performance.filter((p) => p.score < 50).map((p) => p.topic);
      if (weakTopics.length === 0) {
        return reply.send({ message: "🎉 No weak areas!" });
      }

      const response = await openai.completions.create({
        model: "gpt-4-turbo",
        prompt: `Generate a multiple-choice quiz with 3 questions about ${weakTopics.join(", ")}.`,
        max_tokens: 500,
      });

      const questions = response.choices[0].text.trim().split("\n\n").map((q) => {
        const [question, ...options] = q.split("\n");
        return { studentId, question, options: options.slice(0, 4), answer: options[4] };
      });

      await prisma.quiz.createMany({ data: questions });
      return reply.send({ quiz: questions });
    } catch (error) {
      console.error("Error generating quiz:", error);
      return reply.status(500).send({ error: "Failed to generate quiz" });
    }
  });
}