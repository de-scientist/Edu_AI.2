// Import necessary modules
import Fastify from "fastify";
import fetch from "node-fetch";
globalThis.fetch = fetch;
// import websocket from "@fastify/websocket";  // WebSocket package (commented out)
import fastifyCors from "@fastify/cors";
import axios from "axios";
// import fastifySocketIO from "fastify-socket.io"; // Commented out this line
import speakeasy from "speakeasy";
import bcrypt from "bcryptjs";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import prisma from "./prisma/db.js";
import fastifyFormbody from "@fastify/formbody";  
import OpenAI from "openai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import resourcesRoutes from "./routes/resources.js";
import postsRouter from "./routes/posts.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import routes
import progressRoutes from "./routes/progress.js";
import learningPathRoutes from "./routes/learningPath.js";
import chatbotRoutes from "./routes/chatbot.js";
import quizRoutes from "./routes/quiz.js";
import achievementsRoutes from "./routes/achievements.js";
import studyPlannerRoutes from "./routes/studyPlanner.js";
import gamificationRoutes from "./routes/gamification.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import aiSystemTuningRoutes from "./routes/aiSystemTuning.js";
import courseRoutes from "./routes/courses.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
console.log("Loaded JWT Secret:", process.env.JWT_SECRET);

// ✅ Test Prisma Database Connection before starting the server
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Authentication middleware
const authenticate = async (request, reply) => {
  try {
    await request.jwtVerify();
    return;
  } catch (err) {
    reply.send(err);
  }
};

// Start the server
const start = async () => {
  try {
    // Test database connection
    await testDatabaseConnection();
    
    // Create Fastify instance
    const fastify = Fastify({
      logger: true
    });
    
    // Register plugins
    await fastify.register(fastifyCors, {
      origin: (origin, cb) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
          cb(null, true);
          return;
        }
        // Allow both localhost and IP address
        const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.169:3000'];
        if (allowedOrigins.includes(origin)) {
          cb(null, true);
          return;
        }
        cb(new Error('Not allowed by CORS'), false);
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });
    
    await fastify.register(fastifyJwt, {
      secret: process.env.JWT_SECRET || "your-secret-key"
    });
    
    await fastify.register(fastifyCookie);
    await fastify.register(fastifyFormbody);
    
    // Register routes
    await fastify.register(authRoutes);
    await fastify.register(progressRoutes);
    await fastify.register(learningPathRoutes);
    await fastify.register(chatbotRoutes);
    await fastify.register(quizRoutes);
    await fastify.register(achievementsRoutes);
    await fastify.register(studyPlannerRoutes);
    await fastify.register(gamificationRoutes);
    await fastify.register(analyticsRoutes);
    await fastify.register(adminRoutes);
    await fastify.register(resourcesRoutes);
    await fastify.register(postsRouter);
    await fastify.register(usersRoutes);
    await fastify.register(aiSystemTuningRoutes);
    await fastify.register(courseRoutes);
    
    // Health check route
    fastify.get("/health", async (request, reply) => {
      return { status: "ok" };
    });
    
    // Start the server
    await fastify.listen({ port: process.env.PORT || 5000, host: "0.0.0.0" });
    console.log(`Server is running on port ${process.env.PORT || 5000}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

start();