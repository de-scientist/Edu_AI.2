import Fastify from "fastify";
import fastifyWebsocket from "@fastify/websocket";
import cors from "@fastify/cors";
import * as tf from "@tensorflow/tfjs-node";
import joblib from "joblib";
import Redis from "ioredis";
import axios from "axios"; // Ensure axios is imported
import { Server } from "socket.io";
import bcrypt from "bcryptjs";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import prisma from "./prisma/db.js";
import { fetchCourseraCourses } from "./services/coursera.js";
import { fetchUdemyCourses } from "./services/udemy.js";
import { fetchAndStoreCourseraCourses } from "./services/coursera.js";
import courseRoutes from "./routes/courses.js";
import progressRoutes from "./routes/progress.js";
import interactionRoutes from "./routes/interactions.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";
import OpenAI from "openai/index.mjs";

fastify.register(fastifyWebsocket);
const io = new Server(fastify.server, { cors: { origin: "*" } });
const redis = new Redis();
const model = await tf.loadLayersModel("file://course_recommender.h5");
const userEncoder = joblib.load("user_encoder.pkl");
const courseEncoder = joblib.load("course_encoder.pkl");
const scaler = joblib.load("scaler.pkl");
const recommender = joblib.load("course_recommender.pk1");
const openai = new OpenAI({ apiKey: "process.env.OPENAI_API_KEY"});
fastify.register(fastifySocketIO);

const COURSERA_API_URL = "https://api.coursera.org/api/courses.v1";
const API_KEY = "your_coursera_api_key"; 
const UDEMY_API_URL = "https://www.udemy.com/api-2.0/courses/";
const UDEMY_CLIENT_ID = "your_udemy_client_id";  
const UDEMY_CLIENT_SECRET = "your_udemy_client_secret"; 
const EDX_API_URL = "https://api.edx.org/catalog/v1/courses";
const EDX_API_KEY = "your_edx_api_key"; 

const fastify = Fastify({ logger: true });
fastify.register(cors, { origin: "*" });

//Track online users and Broadcast updates when Users connect/disconnect
let onlineUsers = new Map();

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

//WebSockets only allow authenticated users
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

//Register JWT with a secret key
fastify.register(fastifyJwt, { secret: "your_secret_key" });
fastify.register(fastifyCookie);

fastify.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized" });
  }
});

//User Register/SignUp
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

//User login/SignIn with Refresh Token 
fastify.post("/login", async (req, reply) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return reply.status(401).send({ error: "Invalid Password! Input Correct Password" });
  }

  await prisma.loginHistory.create({ data: { userId: user.id } });

  const accessToken = fastify.jwt.sign(
    { id: user.id, role: user.role },
    { expiresIn: "15m" } // Short expiry for security
  );

  const refreshToken = fastify.jwt.sign(
    { id: user.id },
    { expiresIn: "7d" } // Longer expiry
  );

  reply.setCookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/refresh-token",
  });

  reply.send({ accessToken });

  const token = fastify.jwt.sign({ id: user.id, role: user.role });
  reply.send({ token });

fastify.get("/users", async (req, reply) => {
  const users = await prisma.user.findMany();
  reply.send(users);
});

//Refresh Token Endpoint- Allows users get a new access token without logging in again
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



fastify.delete("/users/:id", async (req, reply) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  reply.send({ message: "User deleted" });
});

//Admin Dashboard API for Analytics
fastify.get("/admin/stats", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== "admin") {
    return reply.status(403).send({ error: "Forbidden" });
  }

  const totalUsers = await prisma.user.count();
  const totalLogins = await prisma.loginHistory.count();
  const roleStats = await prisma.user.groupBy({
    by: ["role"],
    _count: { role: true },
  });

  reply.send({ totalUsers, totalLogins, roleStats });
});


//Secure Routes Based on Roles
//Only Admins can Access User Management Routes
fastify.get("/admin/users", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  if (req.user.role !== "admin") return reply.status(403).send({ error: "Forbidden" });

  const users = await prisma.user.findMany();
  reply.send(users);
});


//Handle WebSocket connection
//Listen for messages and broadcast them
fastify.ready().then(() => {
  fastify.io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sendMessage", (msg) => {
      fastify.io.emit("receiveMessage", msg);
    });

    socket.on("disconnect", () => console.log("User disconnected"));
  });
});



// WebSocket setup
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection) => {
    connection.socket.on('message', async (message) => {
      const data = JSON.parse(message);
      
      // Store in database
      const progress = await prisma.progress.create({
        data: {
          userId: data.userId,
          courseId: data.courseId,
          progress: data.progress,
        },
      });

      // Cache update in Redis
      await redis.set(`progress:${data.userId}:${data.courseId}`, JSON.stringify(progress), 'EX', 3600);

      // Broadcast to all clients
      fastify.websocketServer.clients.forEach(client => {
        if (client.readyState === 1) {
          client.send(JSON.stringify(progress));
        }
      });
    });
  });
});

// Fetch student progress from Redis or DB
fastify.get('/progress/:userId/:courseId', async (req, reply) => {
  const { userId, courseId } = req.params;

  // Check Redis cache first
  const cachedData = await redis.get(`progress:${userId}:${courseId}`);
  if (cachedData) return reply.send(JSON.parse(cachedData));

  // Fetch from DB if not in cache
  const progress = await prisma.progress.findFirst({
    where: { userId, courseId },
  });

  if (progress) {
    await redis.set(`progress:${userId}:${courseId}`, JSON.stringify(progress), 'EX', 3600);
  }

  return reply.send(progress || { message: "No progress found" });
});

io.on("connection", (socket) => {
  console.log("📡 Student connected:", socket.id);

  socket.on("progress_update", async (data) => {
    const { userId, courseId, progress } = data;

    await prisma.progress.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { progress },
      create: { userId, courseId, progress },
    });

    io.emit("progress_broadcast", { userId, courseId, progress });
  });

  socket.on("disconnect", () => {
    console.log("❌ Student disconnected:", socket.id);
  });
});

async function getCachedData(key, fetchFunction) {
  const cachedData = await redis.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const freshData = await fetchFunction();
  await redis.setex(key, 3600, JSON.stringify(freshData)); // Cache for 1 hour
  return freshData;
}

// Test Route
fastify.get("/", async (request, reply) => {
  return { message: "Edu_AI Fastify Backend is Running 🚀" };
});

// Fetch AI-based Recommendations with Redis Cache
fastify.get("/recommendations", async (request, reply) => {
  try {
    const { topic, userId } = request.query;
    const cacheKey = `recommendations:${userId}:${topic}`;

    const cachedRecommendations = await redis.get(cacheKey);
    if (cachedRecommendations) {
      return JSON.parse(cachedRecommendations);
    }

    const userIndex = userEncoder.transform([userId]);
    const predictions = model.predict(tf.tensor2d([[userIndex]])).argMax(-1).dataSync();
    const recommendedCourseIDs = courseEncoder.inverse_transform(predictions);

    const recommendedCourses = await prisma.course.findMany({
      where: { id: { in: recommendedCourseIDs } }
    });

    await redis.setex(cacheKey, 3600, JSON.stringify(recommendedCourses)); // Cache recommendations for 1 hour

    return { success: true, recommendedCourses };
  } catch (error) {
    console.error("❌ Error generating recommendations:", error);
    return reply.status(500).send({ success: false, error: "Failed to fetch recommendations" });
  }
});

// Fetch trending courses from Coursera with Redis Cache
fastify.get("/coursera/trending", async (request, reply) => {
  return getCachedData("coursera_trending", async () => {
    const response = await axios.get(COURSERA_API_URL, {
      headers: { Authorization: `Bearer ${API_KEY}` },
      params: { limit: 10 }
    });

    return response.data.elements.map(course => ({
      id: course.id,
      title: course.name,
      description: course.description,
      url: `https://www.coursera.org/learn/${course.slug}`,
      image: course.photoUrl
    }));
  });
});

// Fetch Udemy courses with Redis Cache
fastify.get("/udemy/courses", async (request, reply) => {
  const { topic } = request.query;
  const cacheKey = `udemy_courses:${topic}`;

  return getCachedData(cacheKey, async () => {
    const response = await axios.get(UDEMY_API_URL, {
      headers: { Authorization: `Basic ${Buffer.from(`${UDEMY_CLIENT_ID}:${UDEMY_CLIENT_SECRET}`).toString("base64")}` },
      params: { search: topic || "AI", page_size: 10 }
    });

    return response.data.results.map(course => ({
      id: course.id,
      title: course.title,
      description: course.headline,
      url: `https://www.udemy.com/course/${course.url}`,
      image: course.image_480x270
    }));
  });
});

// Fetch EdX courses with Redis Cache
fastify.get("/edx/courses", async (request, reply) => {
  const { topic } = request.query;
  const cacheKey = `edx_courses:${topic}`;

  return getCachedData(cacheKey, async () => {
    const response = await axios.get(EDX_API_URL, {
      headers: { Authorization: `Bearer ${EDX_API_KEY}` },
      params: { search: topic || "AI", limit: 10 }
    });

    return response.data.results.map(course => ({
      id: course.uuid,
      title: course.title,
      description: course.short_description,
      url: course.marketing_url,
      image: course.media.image.src
    }));
  });
});

// Fetch users from database with Redis Cache
fastify.get("/users", async (request, reply) => {
  return getCachedData("users_list", async () => {
    return await prisma.user.findMany();
  });
});

// Fetch and store Coursera courses with Redis Cache
fastify.get("/api/courses/coursera/fetch", async (request, reply) => {
  try {
    const result = await fetchAndStoreCourseraCourses();
    await redis.del("coursera_trending"); // Clear cache after fetching
    return result;
  } catch (error) {
    reply.status(500).send({ error: "Failed to fetch and store courses" });
  }
});

// Fetch Coursera Courses with Redis Cache
fastify.get("/api/courses/coursera", async (request, reply) => {
  return getCachedData("coursera_courses", fetchCourseraCourses);
});

// Fetch Udemy Courses with Redis Cache
fastify.get("/api/courses/udemy", async (request, reply) => {
  return getCachedData("udemy_courses", fetchUdemyCourses);
});

fastify.get("/progress", async (req, reply) => {
  const { studentId, courseId } = req.query;

  let progress;
  if (studentId) {
    progress = await prisma.progress.findMany({ where: { studentId } });
  } else if (courseId) {
    progress = await prisma.progress.findMany({ where: { courseId } });
  } else {
    progress = await prisma.progress.findMany();
  }

  reply.send(progress);
});

fastify.get("/leaderboard", async (req, reply) => {
  const topStudents = await prisma.progress.findMany({
    orderBy: { progress: "desc" },
    take: 5, // Top 5 students
    include: { student: true },
  });

  reply.send(topStudents);
});

fastify.get("/weekly-progress", async (req, reply) => {
  const { studentId, courseId } = req.query;

  const whereClause = {};
  if (studentId) whereClause.studentId = studentId;
  if (courseId) whereClause.courseId = courseId;

  const weeklyProgress = await prisma.$queryRaw`
    SELECT 
      DATE_TRUNC('week', "updatedAt") AS week, 
      AVG(progress) AS avg_progress 
    FROM "Progress" 
    ${studentId || courseId ? prisma.sql`WHERE "studentId" = ${studentId} OR "courseId" = ${courseId}` : prisma.sql``}
    GROUP BY week 
    ORDER BY week ASC;
  `;

  reply.send(weeklyProgress);
});

fastify.get("/student-report", async (req, reply) => {
  const { studentId } = req.query;

  if (!studentId) {
    return reply.status(400).send({ error: "Student ID is required" });
  }

  const studentProgress = await prisma.progress.findMany({
    where: { studentId },
    include: { course: true },
  });

  reply.send(studentProgress);
});

const tf = require("@tensorflow/tfjs-node");
 model;

async function loadModel() {
  model = await tf.loadLayersModel(`file://./model/model.json`);
  console.log("✅ AI Model Loaded");
}
loadModel();

fastify.get("/predict-progress", async (req, reply) => {
  const { week, past_progress } = req.query;

  if (!week || !past_progress) {
    return reply.status(400).send({ error: "Week and past_progress required" });
  }

  const prediction = model.predict(tf.tensor2d([[parseInt(week), parseFloat(past_progress)]]));
  const predictedProgress = (await prediction.array())[0][0];

  reply.send({ predictedProgress });
});


const { sendAlertEmail } = require("./emailService");

fastify.get("/check-low-progress", async (req, reply) => {
  const lowProgressStudents = await prisma.progress.findMany({
    where: { progress: { lt: 40 } },
    include: { student: true },
  });

  for (const student of lowProgressStudents) {
    await sendAlertEmail(student.studentId, "admin@eduai.com");
  }

  reply.send({ message: "Alerts sent!" });
});


// AI Tutoring Route
fastify.post("/tutor/hint", async (req, reply) => {
  const { userId, question, studentAnswer } = req.body;

  // Check cache first
  const cacheKey = `hint:${userId}:${question}`;
  const cachedHint = await redis.get(cacheKey);
  if (cachedHint) return reply.send({ hint: cachedHint });

  // Analyze answer & generate a hint
  const prompt = `Student Answer: "${studentAnswer}"\n
  Identify mistakes and provide a helpful hint.`;
  
  const aiResponse = await openai.completions.create({
    model: "gpt-4",
    prompt: prompt,
    max_tokens: 50,
  });

  const hint = aiResponse.choices[0].text.trim();

  // Store in Redis cache
  await redis.set(cacheKey, hint, "EX", 3600); // Expires in 1 hour

  return reply.send({ hint });
});



fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server running at ${address}`);
});
