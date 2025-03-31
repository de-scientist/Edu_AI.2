// Import necessary modules
import Fastify from "fastify";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";
import axios from "axios";
import fastifySocketIO from "fastify-socket.io";
import speakeasy from "speakeasy";
import bcrypt from "bcryptjs";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import prisma from "./prisma/db.js";
import fastifyFormbody from "@fastify/formbody";  
//import fastifyJson from "@fastify/json"; 
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();


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

// Initialize Fastify
const fastify = Fastify({ logger: true });

// CORS Config
fastify.register(cors, {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// Register plugins
fastify.register(fastifyJwt, { secret: process.env.JWT_SECRET });
fastify.register(fastifyCookie);
fastify.register(fastifyFormbody); 
//fastify.register(fastifyJson);  
fastify.register(fastifySocketIO, {
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// In-memory cache
const cache = new Map();
const setCache = (key, value, ttl = 60000) => {
  cache.set(key, { value, expires: Date.now() + ttl });
  setTimeout(() => cache.delete(key), ttl);
};
const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached || Date.now() > cached.expires) {
    cache.delete(key);
    return null;
  }
  return cached.value;
};

// OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Register route handlers
fastify.register(authRoutes);
fastify.register(adminRoutes);
fastify.register(courseRoutes);
fastify.register(progressRoutes);
fastify.register(analyticsRoutes);
fastify.register(interactionRoutes)


/* Register the JSON parser
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
  try {
    const parsed = JSON.parse(body);
    done(null, parsed);
  } catch (err) {
    done(err);
  }
});*/


// Track online users
let onlineUsers = new Map();

// Authenticate Middleware
fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// WebSockets
fastify.ready().then(() => {
  console.log("Fastify is ready. WebSockets can now be used.");

  fastify.io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("WebSocket rejected: No token.");
      return next(new Error("Unauthorized"));
    }

    try {
      const user = await fastify.jwt.verify(token);
      socket.user = user;
      next();
    } catch (err) {
      console.log("WebSocket auth failed:", err.message);
      return next(new Error("Invalid token"));
    }
  });

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
fastify.post(
  "/api/signup",
  {
    schema: {
      body: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string", minLength: 2 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 6 },
          role: { type: "string", enum: ["STUDENT", "LECTURER", "ADMIN"] }
        }
      }
    }
  },
  async (req, reply) => {
    const { name, email, password, role } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });
      reply.send({ message: "User registered successfully", user });
    } catch (error) {
      if (error.code === "P2002") {  // Prisma unique constraint error
        return reply.status(400).send({ error: "Email already in use" });
      }
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
);


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

// Refresh Token
fastify.post("/refresh-token", async (req, reply) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return reply.status(401).send({ error: "No refresh token" });

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
