const fastify = require("fastify")();
const { PrismaClient } = require("@prisma/client");
const OpenAI = require("openai");

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

fastify.post("/check-answer", async (req, reply) => {
  const { questionId, studentAnswer } = req.body;
  const question = await prisma.question.findUnique({ where: { id: questionId } });

  if (studentAnswer === question.answer) {
    return reply.send({ correct: true, message: "✅ Correct!" });
  }

  const response = await openai.completions.create({
    model: "gpt-4-turbo",
    prompt: `The student answered incorrectly.\n\nQuestion: ${question.text}\nCorrect Answer: ${question.answer}\nStudent Answer: ${studentAnswer}\n\nProvide an explanation:`,
    max_tokens: 150,
  });

  reply.send({ correct: false, message: response.choices[0].text.trim() });
});

fastify.post("/generate-quiz", async (req, reply) => {
  const { studentId } = req.body;
  const performance = await prisma.studentPerformance.findMany({ where: { studentId } });

  const weakTopics = performance.filter((p) => p.score < 50).map((p) => p.topic);
  if (weakTopics.length === 0) return reply.send({ message: "🎉 No weak areas!" });

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
  reply.send({ quiz: questions });
});