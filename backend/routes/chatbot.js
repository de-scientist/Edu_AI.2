import prisma from "../prisma/db.js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function chatbotRoutes(fastify, options) {
  // Send a message to the AI chatbot
  fastify.post("/api/student/chat", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId, message, context } = request.body;
      
      if (!userId || !message) {
        return reply.status(400).send({ error: "User ID and message are required" });
      }
      
      // Get user's learning context
      const userProgress = await prisma.progress.findMany({
        where: { userId },
        include: {
          course: true,
          module: true
        }
      });
      
      // Get recent chat history
      const chatHistory = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      
      // Prepare context for the AI
      const learningContext = userProgress.map(p => ({
        course: p.course.name,
        module: p.module?.name,
        progress: p.progress
      }));
      
      const systemPrompt = `You are an AI tutor helping a student with their studies. 
        The student's current learning context:
        ${JSON.stringify(learningContext)}
        
        Recent chat history:
        ${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}
        
        Please provide a helpful, educational response that takes into account the student's current progress and learning context.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      const aiResponse = response.choices[0].message.content;
      
      // Save the conversation
      await prisma.chatMessage.createMany({
        data: [
          {
            userId,
            role: "user",
            content: message
          },
          {
            userId,
            role: "assistant",
            content: aiResponse
          }
        ]
      });
      
      return reply.send({
        message: aiResponse,
        context: learningContext
      });
    } catch (error) {
      console.error("Error in chatbot:", error);
      return reply.status(500).send({ error: "Failed to process chat message" });
    }
  });
  
  // Get chat history
  fastify.get("/api/student/chat/history", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.query;
      
      if (!userId) {
        return reply.status(400).send({ error: "User ID is required" });
      }
      
      const chatHistory = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        include: {
          user: {
            select: {
              name: true,
              avatar: true
            }
          }
        }
      });
      
      return reply.send(chatHistory);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return reply.status(500).send({ error: "Failed to fetch chat history" });
    }
  });
  
  // Clear chat history
  fastify.delete("/api/student/chat/history", { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.query;
      
      if (!userId) {
        return reply.status(400).send({ error: "User ID is required" });
      }
      
      await prisma.chatMessage.deleteMany({
        where: { userId }
      });
      
      return reply.send({ message: "Chat history cleared successfully" });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      return reply.status(500).send({ error: "Failed to clear chat history" });
    }
  });
}
