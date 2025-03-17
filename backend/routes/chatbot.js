const fastify = require("fastify")();
const OpenAI = require("openai");

const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

fastify.post("/chat", async (req, reply) => {
  const { question } = req.body;

  const response = await openai.completions.create({
    model: "gpt-4-turbo",
    prompt: `Explain the following: ${question}`,
    max_tokens: 150,
  });

  reply.send({ answer: response.choices[0].text.trim() });
});
