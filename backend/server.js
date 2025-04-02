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
//import fastifyFormbody from "@fastify/formbody";  
//import fastifyJson from "@fastify/json"; 
import OpenAI from "openai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();


// ✅ Test Prisma Database Connection before starting the server
async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to database.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1); // Exit if DB connection fails
  }
}
testDatabaseConnection();  // Call the function before running Fastify

// Import routes
import myPreHandler from "./middleware/auth.js"; // Authentication middleware
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
fastify.register(import("@fastify/formbody"));
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

// Register the JSON parser
fastify.addContentTypeParser("application/json", { parseAs: "string" }, (req, body, done) => {
  try {
    const parsed = JSON.parse(body);
    done(null, parsed);
  } catch (err) {
    done(err);
  }
});


// Track online users
let onlineUsers = new Map();

// Middleware for authentication
fastify.addHook("preHandler", myPreHandler);

// 📌 Middleware for JWT Authentication
fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();  // Verify the JWT
  } catch (err) {
    console.error("JWT Authentication Error:", err);  // 🔥 Debug this!
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
fastify.post("/api/signup", { 
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
}, async (req, reply) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    reply.send({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Error during user registration:", error);
    if (error.code === "P2002") {
      return reply.status(400).send({ error: "Email already in use" });
    }
    reply.status(500).send({ error: "Internal Server Error", details: error.message });
  }
});


// ✅ Function to find user in database
async function findUserByEmail(email) {
  return await prisma.user.findUnique({
      where: { email },
  });
}

// ✅ Login Route
fastify.post("/login", async (req, reply) => {
  try {
    const { email, password } = req.body;
    console.log("Incoming Login Request:", { email });

    // 🔹 Check if user exists
    const user = await findUserByEmail(email);
    if (!user) {
      console.warn("Login failed: User not found");
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    console.log("User found:", { id: user.id, role: user.role });

    // 🔹 Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.warn("Login failed: Incorrect password");
      return reply.status(401).send({ error: "Invalid email or password" });
    }

    // ✅ Validate Role
    const validRoles = ["admin", "student", "lecturer"];
    if (!validRoles.includes(user.role.toLowerCase())) {
      console.error("Invalid role detected:", user.role);
      return reply.status(403).send({ error: "Invalid role, please contact support." });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return reply.send({
      token,
      user: { id: user.id, email: user.email, role: user.role },  // Send back user info along with token
    });

  } catch (error) {
    console.error("Login error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});



// Refresh Token Route
fastify.post("/refresh-token", async (req, reply) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return reply.status(401).send({ error: "No refresh token" });

  try {
    const decoded = fastify.jwt.verify(refreshToken);
    const newAccessToken = fastify.jwt.sign({ id: decoded.id, role: decoded.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
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

// 🚀 Create a course
fastify.post("/api/courses", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
      const { title, description, instructorId, duration, category } = req.body;
      if (!title || !description || !instructorId || !duration || !category) {
          return reply.status(400).send({ error: "Missing required fields" });
      }

      const newCourse = await prisma.course.create({
          data: { title, description, instructorId, duration, category },
      });

      reply.status(201).send(newCourse);
  } catch (error) {
      console.error("Error creating course:", error);
      reply.status(500).send({ error: "Internal Server Error" });
  }
});

// ✏️ Update a course
fastify.put("/api/courses/:id", async (req, reply) => {
  try {
      const { id } = req.params;
      const { title, description, duration } = req.body;

      const updatedCourse = await prisma.course.update({
          where: { id },
          data: { title, description, duration },
      });

      reply.send(updatedCourse);
  } catch (error) {
      console.error("Error updating course:", error);
      reply.status(500).send({ error: "Internal Server Error" });
  }
});

// 📜 Fetch all courses
fastify.get("/api/courses", async (_, reply) => {
  try {
      const courses = await prisma.course.findMany();
      reply.send(courses);
  } catch (error) {
      console.error("Error fetching courses:", error);
      reply.status(500).send({ error: "Internal Server Error" });
  }
});

// 🔍 Fetch a single course
fastify.get("/api/courses/:id", async (req, reply) => {
  try {
      const { id } = req.params;

      const course = await prisma.course.findUnique({ where: { id } });

      if (!course) {
          return reply.status(404).send({ error: "Course not found" });
      }

      reply.send(course);
  } catch (error) {
      console.error("Error fetching course:", error);
      reply.status(500).send({ error: "Internal Server Error" });
  }
});

// ❌ Delete a course
fastify.delete("/api/courses/:id", async (req, reply) => {
  try {
      const { id } = req.params;

      await prisma.course.delete({ where: { id } });

      reply.send({ message: "Course deleted successfully" });
  } catch (error) {
      console.error("Error deleting course:", error);
      reply.status(500).send({ error: "Internal Server Error" });
  }
});

// 📈 Progress APIs
fastify.post("/api/progress", { preHandler: authenticate }, async (req, reply) => {
  const { studentId, courseId, progressPercentage } = req.body;
  const progress = await prisma.progress.create({
    data: { studentId, courseId, progressPercentage },
  });
  reply.code(201).send(progress);
});

fastify.get("/api/progress/:studentId", { preHandler: authenticate }, async (req, reply) => {
  const { studentId } = req.params;
  const progress = await prisma.progress.findMany({ where: { studentId } });
  reply.send(progress);
});

// 🔄 WebSocket APIs
fastify.register(async (fastify) => {
  fastify.get("/ws", { websocket: true }, (connection) => {
    connection.socket.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.event === "message") {
        fastify.websocketServer.clients.forEach((client) => {
          if (client.readyState === 1) client.send(message);
        });
      } else if (data.event === "userOnline") {
        console.log(`User Online: ${data.userId}`);
      }
    });
  });
});


// Fastify route for generating quiz
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
