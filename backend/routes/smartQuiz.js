fastify.post("/quiz/generate", async (req, reply) => {
    const { userId, topic } = req.body;
  
    // Check student history from DB
    const performance = await prisma.performance.findMany({
      where: { userId, topic },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  
    const correctAnswers = performance.filter((p) => p.correct).length;
    let difficulty = "medium";
  
    if (correctAnswers < 2) difficulty = "easy";
    else if (correctAnswers > 3) difficulty = "hard";
  
    // AI-generated quiz question
    const prompt = `Generate a ${difficulty} level quiz question on ${topic}.`;
    
    const aiResponse = await openai.completions.create({
      model: "gpt-4",
      prompt: prompt,
      max_tokens: 100,
    });
  
    const question = aiResponse.choices[0].text.trim();
  
    return reply.send({ question, difficulty });
  });
  