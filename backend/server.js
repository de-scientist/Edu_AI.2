// Import necessary modules
import Fastify from "fastify";
import fetch from "node-fetch";
globalThis.fetch = fetch;
import websocket from "@fastify/websocket";  // WebSocket package
import fastifyCors from "@fastify/cors";
import axios from "axios";
// import fastifySocketIO from "fastify-socket.io"; // Comment out this line
import speakeasy from "speakeasy";
import bcrypt from "bcryptjs";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import prisma from "./prisma/db.js";
import fastifyFormbody from "@fastify/formbody";  
import OpenAI from "openai";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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
testDatabaseConnection();

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

// 🔹 CORS Configuration (Applies to HTTP Requests)
fastify.register(fastifyCors, {
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

// 🔹 Register Plugins
fastify.register(fastifyJwt, {
  secret: process.env.JWT_SECRET,  // Use JWT secret from .env
});
fastify.register(fastifyCookie);
fastify.register(fastifyFormbody);
// Comment out the fastify-socket.io plugin registration
// fastify.register(fastifySocketIO, {
//   cors: {
//     origin: ["http://localhost:3000"],
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });


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

// 🔹 Register JSON Parser
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

// 🔹 Middleware for JWT Authentication (For HTTP Routes)
fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    console.error("JWT Authentication Error:", err);
    reply.status(401).send({ error: "Unauthorized" });
  }
});

// WebSocket Route (Using @fastify/websocket instead of fastify-socket.io)
fastify.register(websocket); // Register WebSocket plugin

fastify.get("/ws", { websocket: true }, (connection, req) => {
  try {
    const token = req.headers["sec-websocket-protocol"]; // Retrieve token from headers

    if (!token) {
      connection.socket.close(1008, "Unauthorized"); // Close connection if no token
      return;
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        connection.socket.close(1008, "Invalid token");
        return;
      }

      console.log("✅ WebSocket connected:", decoded);
      
      connection.socket.on("message", (message) => {
        console.log("📩 Received:", message.toString());
      });

      connection.socket.send("🔗 Connection Established!");
    });
  } catch (err) {
    console.error("❌ WebSocket Error:", err);
    connection.socket.close(1011, "Internal Server Error");
  }
});

// Graceful Shutdown Handling (Close Prisma)
process.on("SIGINT", async () => {
  console.log("🚦 Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
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

    // ✅ Validate Role (Ensure case insensitivity)
    const validRoles = ["admin", "student", "lecturer"];
    const userRole = user.role.toLowerCase(); // Normalize role
    if (!validRoles.includes(userRole)) {
      console.error("Invalid role detected:", user.role);
      return reply.status(403).send({ error: "Invalid role, please contact support." });
    }

    // ✅ Generate JWT token securely
    const token = jwt.sign(
      { userId: user.id, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    return reply.send({
      token,
      user: { id: user.id, email: user.email, role: userRole }, // Ensure lowercase role is sent
    });

  } catch (error) {
    console.error("Login error:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});


fastify.get("/eduai/stats", { preHandler: authenticate }, async (req, reply) => {
  return reply.send({ message: "Stats data here" });
});

fastify.get("/eduai/users", { preHandler: authenticate }, async (req, reply) => {
  return reply.send({ users: [{ id: 1, name: "John Doe" }] });
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

// ✅ Create Course
fastify.post("/api/courses", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
    const { title, description, instructorId, duration, category } = req.body;
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

// ✅ Fetch All Courses
fastify.get("/api/courses", async (_, reply) => {
  try {
    const courses = await prisma.course.findMany();
    reply.send(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// ✅ Fetch Course by ID
fastify.get("/api/courses/:id", async (req, reply) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ where: { id: Number(id) } });

    if (!course) return reply.status(404).send({ error: "Course not found" });
    reply.send(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    reply.status(500).send({ error: "Internal Server Error" });
  }
});

// ✅ Delete Course
fastify.delete("/api/courses/:id", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id: Number(id) } });
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

// ✅ Admin Stats
fastify.get("/admin/stats", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== "admin") return reply.status(403).send({ error: "Forbidden" });

  const totalUsers = await prisma.user.count();
  const roleStats = await prisma.user.groupBy({ by: ["role"], _count: true });

  reply.send({ totalUsers, roleStats });
});

// Start Fastify server
fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log("Server running on http://localhost:5000");
});