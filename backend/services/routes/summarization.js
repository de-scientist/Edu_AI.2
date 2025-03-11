const fastify = require("fastify")();
const OpenAI = require("openai");
const multer = require("fastify-multer");
const fs = require("fs");

const openai = new OpenAI({ apiKey: "YOUR_OPENAI_API_KEY" });

const upload = multer({ dest: "uploads/" });

fastify.post("/summarize", { preHandler: upload.single("file") }, async (req, reply) => {
  const filePath = req.file.path;
  const text = fs.readFileSync(filePath, "utf8");

  const response = await openai.completions.create({
    model: "gpt-4-turbo",
    prompt: `Summarize this lecture note:\n\n${text}`,
    max_tokens: 250,
  });

  reply.send({ summary: response.choices[0].text.trim() });
});
