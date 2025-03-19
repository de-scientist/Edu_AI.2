// Import necessary modules
import Fastify from "fastify";
import fetch from "node-fetch"; // For making API requests
globalThis.fetch = fetch;
import websocket from "@fastify/websocket"; // WebSocket support
import cors from "@fastify/cors"; // CORS for cross-origin requests
import axios from "axios"; // HTTP requests
import fastifySocketIO from "fastify-socket.io"; // Fastify Socket.io plugin
import speakeasy from "speakeasy"; // 2FA authentication
import bcrypt from "bcryptjs"; // Password hashing
import fastifyJwt from "@fastify/jwt"; // JWT authentication
import fastifyCookie from "@fastify/cookie"; // Cookie support
import prisma from "./prisma/db.js"; // Database ORM
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

// Import routes
import courseRoutes from "./routes/courses.js";
import progressRoutes from "./routes/progress.js";
import interactionRoutes from "./routes/interactions.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

// Import helper functions
import { hashPassword, comparePassword, authenticate } from "./helpers/auth.js";
import { sendNotification } from "./helpers/notifications.js";
import { transporter, sendEmail } from "./helpers/email.js";

// Initialize Fastify server with logging enabled
const fastify = Fastify({ logger: true });

// Enable CORS to allow requests from different origins
fastify.register(cors, { origin: "*" });

// Register plugins before using them
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,
}); // JWT authentication
fastify.register(fastifyCookie); // Cookie support
fastify.register(fastifySocketIO); // WebSocket support

// In-memory cache (Replacing Redis)
const cache = new Map();

// Cache helper functions
const setCache = (key, value, ttl = 60000) => {
  cache.set(key, { value, expires: Date.now() + ttl });
  setTimeout(() => cache.delete(key), ttl); // Auto-remove after TTL expires
};

const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  return cached.value;
};

// OpenAI API Key (ensure it's stored in environment variables for security)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Register route handlers
fastify.register(authRoutes);
fastify.register(adminRoutes);
fastify.register(courseRoutes);
fastify.register(progressRoutes);
fastify.register(analyticsRoutes);

// Track online users
let onlineUsers = new Map();

// Middleware to authenticate JWT
fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// Ensure Fastify is ready before using WebSockets
fastify.ready().then(() => {
  console.log("Fastify is ready. WebSockets can now be used.");

  // WebSocket authentication middleware
  fastify.io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const user = await fastify.jwt.verify(token);
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  // Handle WebSocket connections
  fastify.io.on("connection", (socket) => {
    console.log("User connected:", socket.user?.id || socket.id);

    socket.on("userOnline", () => {
      if (socket.user?.id) {
        onlineUsers.set(socket.user.id, socket.id);
        fastify.io.emit("updateUsers", Array.from(onlineUsers.keys()));
      }
    });

    socket.on("disconnect", () => {
      if (socket.user?.id) {
        onlineUsers.delete(socket.user.id);
      }
      fastify.io.emit("updateUsers", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.user?.id || socket.id);
    });
  });
}).catch((err) => {
  console.error("Error initializing Fastify:", err);
});

// Enable Two-Factor Authentication (2FA)
fastify.post(
  "/enable-2fa",
  { preHandler: fastify.authenticate },
  async (req, reply) => {
    const secret = speakeasy.generateSecret();
    await prisma.user.update({
      where: { id: req.user.id },
      data: { otpSecret: secret.base32 },
    });

    reply.send({
      message: "2FA enabled. Use this secret in Google Authenticator.",
      secret: secret.otpauth_url,
    });
  }
);

// User Registration
fastify.post("/register", async (req, reply) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    reply.send({ message: "User registered", user });
  } catch (error) {
    reply.status(400).send({ error: "Email already in use" });
  }
});

// User Login with JWT Authentication
fastify.post("/login", async (req, reply) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ error: "Invalid Password! Input Correct Password" });
  }

  const accessToken = fastify.jwt.sign({ id: user.id, role: user.role }, { expiresIn: "15m" });
  const refreshToken = fastify.jwt.sign({ id: user.id }, { expiresIn: "7d" });

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/refresh-token",
  });

  fastify.io.emit("receive_notification", { type: "login", message: `${user.email} has logged in.` });

  reply.send({ accessToken });
});

// Refresh JWT token
fastify.post("/refresh-token", async (req, reply) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return reply.status(401).send({ error: "No refresh token" });
  }

  try {
    const decoded = fastify.jwt.verify(refreshToken);
    const newAccessToken = fastify.jwt.sign({ id: decoded.id, role: decoded.role }, { expiresIn: "15m" });

    reply.send({ accessToken: newAccessToken });
  } catch (err) {
    return reply.status(401).send({ error: "Invalid refresh token" });
  }
});

// Secure endpoint using authentication middleware
fastify.post("/secure-endpoint", {
  preHandler: [fastify.authenticate],
  handler: async (req, reply) => {
    reply.send({ message: "You are authenticated", user: req.user });
  },
});

// Admin Dashboard Analytics
fastify.get("/admin/stats", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== "admin") return reply.status(403).send({ error: "Forbidden" });

  const totalUsers = await prisma.user.count();
  const totalLogins = await prisma.loginHistory.count();
  const roleStats = await prisma.user.groupBy({ by: ["role"], _count: true });

  reply.send({ totalUsers, totalLogins, roleStats });
});

// Start Fastify server
fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server running on http://localhost:5000");
});
