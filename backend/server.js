// Import necessary modules
import Fastify from "fastify";
import fetch from 'node-fetch'; // For making API requests
globalThis.fetch = fetch;
import websocket from "@fastify/websocket"; // WebSocket support
import cors from "@fastify/cors"; // CORS for cross-origin requests
import Redis from "ioredis"; // Redis for caching and real-time communication
import axios from "axios"; // HTTP requests
import { Server } from "socket.io"; // WebSocket for real-time communication
import fastifySocketIO from "fastify-socket.io";
import speakeasy from "speakeasy"; // 2FA authentication
import nodemailer from "nodemailer"; // Email services
import bcrypt from "bcryptjs"; // Password hashing
import fastifyJwt from "@fastify/jwt"; // JWT authentication
import fastifyCookie from "@fastify/cookie"; // Cookie support
import prisma from "./prisma/db.js"; // Database ORM

// Import AI and Course-related services
import { fetchAndStoreCourseraCourses } from "./services/coursera.js";
import { fetchUdemyCourses } from "./services/udemy.js";

// Import routes
import myPreHandler from './middleware/auth.js';
import courseRoutes from "./routes/courses.js";
import progressRoutes from "./routes/progress.js";
import interactionRoutes from "./routes/interactions.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";
import authRoutes from "./routes/auth.js";

// OpenAI API integration
import OpenAI from "openai";

// Initialize Fastify server with logging enabled
const fastify = Fastify({ logger: true });

// Enable CORS to allow requests from different origins
fastify.register(cors, { origin: "*" });

// Register WebSocket support
fastify.register(websocket);
fastify.register(fastifySocketIO);

// Initialize Socket.io for real-time events
const io = new Server(fastify.server, { cors: { origin: "*" } });

// Initialize Redis for caching
const redis = new Redis();

// OpenAI API Key (ensure it's stored in environment variables for security)
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// API credentials for Coursera, Udemy, and edX
const COURSERA_API_URL = "https://api.coursera.org/api/courses.v1";
const API_KEY = "your_coursera_api_key"; 
const UDEMY_API_URL = "https://www.udemy.com/api-2.0/courses/";
const UDEMY_CLIENT_ID = "your_udemy_client_id";  
const UDEMY_CLIENT_SECRET = "your_udemy_client_secret"; 
const EDX_API_URL = "https://api.edx.org/catalog/v1/courses";
const EDX_API_KEY = "your_edx_api_key"; 

// Register route handlers
fastify.register(authRoutes);
fastify.register(adminRoutes);
fastify.register(courseRoutes);
fastify.register(progressRoutes);
fastify.register(analyticsRoutes);

// Track online users
let onlineUsers = new Map();

// Handle WebSocket connections for online users
fastify.ready().then(() => {
  fastify.io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("userOnline", (userId) => {
      onlineUsers.set(userId, socket.id);
      fastify.io.emit("updateUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
        }
      }
      fastify.io.emit("updateUsers", Array.from(onlineUsers.keys()));
    });
  });
});

// Handle real-time notifications
fastify.ready().then(() => {
  fastify.io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_notification", (data) => {
      fastify.io.emit("receive_notification", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
});

// WebSocket authentication middleware
fastify.ready().then(() => {
  fastify.io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const user = fastify.jwt.verify(token);
      socket.user = user;
      next();
    } catch (err) {
      return next(new Error("Invalid token"));
    }
  });

  fastify.io.on("connection", (socket) => {
    console.log("User connected:", socket.user.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user.id);
    });
  });
});

// Email transporter setup using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "your-email@gmail.com", pass: "your-password" },
});

// Enable Two-Factor Authentication (2FA)
fastify.post("/enable-2fa", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  const secret = speakeasy.generateSecret();
  await prisma.user.update({
    where: { id: req.user.id },
    data: { otpSecret: secret.base32 },
  });

  reply.send({ message: "2FA enabled. Use this secret in Google Authenticator.", secret: secret.otpauth_url });
});

// JWT and Cookie authentication setup
fastify.register(fastifyJwt, { secret: "your_secret_key" });
fastify.register(fastifyCookie);

// Middleware to authenticate JWT
fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// User Registration
fastify.post("/register", async (req, reply) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({ data: { name, email, password: hashedPassword, role } });
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

  reply.setCookie("refreshToken", refreshToken, { httpOnly: true, secure: true, path: "/refresh-token" });

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
    reply.status(401).send({ error: "Invalid refresh token" });
  }
});

// Protect this route using the preHandler middleware
app.post('/api/protected', { preHandler: myPreHandler }, async (req, reply) => {
  reply.send({ message: `Hello, ${req.user.username}` });
});


// Admin Dashboard Analytics
fastify.get("/admin/stats", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== "admin") return reply.status(403).send({ error: "Forbidden" });

  const totalUsers = await prisma.user.count();
  const totalLogins = await prisma.loginHistory.count();
  const roleStats = await prisma.user.groupBy({ by: ["role"], _count: { role: true } });

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
