const fastify = require("fastify")();
const speech = require("@google-cloud/speech");
const textToSpeech = require("@google-cloud/text-to-speech");
const { PrismaClient } = require("@prisma/client");
const natural = require("natural");

const prisma = new PrismaClient();
const speechClient = new speech.SpeechClient();
const ttsClient = new textToSpeech.TextToSpeechClient();
const tokenizer = new natural.WordTokenizer();

async function findAnswer(question) {
  const materials = await prisma.material.findMany();
  const corpus = materials.map((m) => tokenizer.tokenize(m.description).join(" "));

  let bestMatch = corpus.find((doc) => doc.includes(question.toLowerCase()));
  return bestMatch || "I couldn't find an answer. Try rephrasing!";
}

fastify.post("/ask", async (req, reply) => {
  const { audio } = req.body;

  const [transcription] = await speechClient.recognize({
    config: { encoding: "LINEAR16", sampleRateHertz: 16000, languageCode: "en-US" },
    audio: { content: audio },
  });

  const question = transcription.results.map((result) => result.alternatives[0].transcript).join("\n");
  const answer = await findAnswer(question);

  const [response] = await ttsClient.synthesizeSpeech({
    input: { text: answer },
    voice: { languageCode: "en-US", ssmlGender: "FEMALE" },
    audioConfig: { audioEncoding: "MP3" },
  });

  reply.send({ answer, audio: response.audioContent.toString("base64") });
});
