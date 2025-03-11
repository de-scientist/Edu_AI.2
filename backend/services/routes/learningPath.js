const fastify = require("fastify")();
const OpenAI = require("openai");
const Redis = require("ioredis");
const { PrismaClient } = require("@prisma/client");

const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });
const redis = new Redis();
const prisma = new PrismaClient();

fastify.get("/learning-path/:studentId", async (req, reply) => {
  const { studentId } = req.params;

  // Check if cached
  const cachedPath = await redis.get(`learningPath:${studentId}`);
  if (cachedPath) return reply.send(JSON.parse(cachedPath));

  // Get student performance
  const performance = await prisma.performance.findMany({ where: { studentId } });

  const weakAreas = performance
    .filter((p) => p.score < 50)
    .map((p) => p.topic);

  const prompt = `A student is learning programming. Their weak areas: ${weakAreas.join(", ")}. Suggest the next three topics they should study.`;

  const response = await openai.completions.create({
    model: "gpt-4-turbo",
    prompt,
    max_tokens: 100,
  });

  const recommendations = response.choices[0].text.trim().split("\n");

  // Cache result
  await redis.setex(`learningPath:${studentId}`, 3600, JSON.stringify(recommendations));

  reply.send(recommendations);
});
