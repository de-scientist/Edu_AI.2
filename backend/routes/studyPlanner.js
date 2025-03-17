const fastify = require("fastify")();
const { PrismaClient } = require("@prisma/client");
const OpenAI = require("openai");

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

fastify.post("/generate-study-plan", async (req, reply) => {
  const { studentId, studyHours } = req.body;
  const performance = await prisma.studentPerformance.findMany({ where: { studentId } });

  const weakTopics = performance.filter((p) => p.score < 50).map((p) => p.topic);
  if (weakTopics.length === 0) return reply.send({ message: "🎉 No weak areas!" });

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

  reply.send({ studyPlan: plan });
});
