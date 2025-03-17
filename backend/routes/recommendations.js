const fs = require("fs");
const natural = require("natural");
const { PrismaClient } = require("@prisma/client");
const Redis = require("ioredis");
const OpenAI = require("openai");

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: ""});
const redis = new Redis();
const tokenizer = new natural.WordTokenizer();
const modelData = JSON.parse(fs.readFileSync("tfidf_model.json"));

//AI suggests study materials for weak areas
fastify.post("/recommend-study", async (req, reply) => {
  const { studentId } = req.body;
  const performance = await prisma.studentPerformance.findMany({ where: { studentId } });

  const weakTopics = performance.filter((p) => p.score < 50).map((p) => p.topic);
  if (weakTopics.length === 0) return reply.send({ message: "🎉 No weak areas!" });

  const response = await openai.completions.create({
    model: "gpt-4-turbo",
    prompt: `Suggest study materials for these topics: ${weakTopics.join(", ")}`,
    max_tokens: 200,
  });

  reply.send({ recommendations: response.choices[0].text.trim() });
});

async function getRecommendations(studentId) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: { progress: true },
  });

  const weakTopics = student.progress
    .filter((p) => p.score < 50)
    .map((p) => tokenizer.tokenize(p.topic).join(" "));

  const matches = modelData.filter((doc) => weakTopics.some((topic) => doc.includes(topic)));

  return matches.slice(0, 5); // Return top 5 recommendations
}

fastify.get("/recommendations/:studentId", async (req, reply) => {
  const { studentId } = req.params;

  const cacheKey = `recommendations:${studentId}`;
  const cachedData = await redis.get(cacheKey);

  if (cachedData) return reply.send(JSON.parse(cachedData));

  const recommendations = await getRecommendations(studentId);
  await redis.set(cacheKey, JSON.stringify(recommendations), "EX", 3600); // Cache for 1 hour

  reply.send(recommendations);
});
