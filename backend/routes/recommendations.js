import fastifyPlugin from "fastify-plugin";
import prisma from "../prisma/db.js";
import fs from "fs";
import path from "path";
import natural from "natural";
import OpenAI from "openai";
import dotenv from "dotenv";
import cache from "../lib/cache.js";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const tokenizer = new natural.WordTokenizer();

// Load model data if it exists
let modelData = [];
try {
  const modelPath = path.join(__dirname, "..", "tfidf_model.json");
  if (fs.existsSync(modelPath)) {
    modelData = JSON.parse(fs.readFileSync(modelPath, "utf8"));
    console.log("✅ Loaded TF-IDF model data");
  } else {
    console.log("⚠️ TF-IDF model data not found, using empty array");
  }
} catch (error) {
  console.error("Error loading model data:", error);
}

export default fastifyPlugin(async (fastify, opts) => {
  // AI suggests study materials for weak areas
  fastify.post("/api/recommend-study", async (request, reply) => {
    try {
      const { id } = request.body;
      
      if (!id) {
        return reply.status(400).send({ error: "Student ID is required" });
      }
      
      // Check cache first
      const cachedRecommendations = await cache.get(`recommendations:${id}`);
      if (cachedRecommendations) {
        return reply.send(JSON.parse(cachedRecommendations));
      }
      
      // Get student performance data
      const performance = await prisma.studentPerformance.findMany({ 
        where: { studentId: id } 
      });
      
      if (!performance || performance.length === 0) {
        return reply.status(404).send({ error: "No performance data found for this student" });
      }
      
      // Identify weak topics
      const weakTopics = performance
        .filter(p => p.score < 70)
        .map(p => p.topic);
      
      if (weakTopics.length === 0) {
        return reply.send({ message: "No weak areas identified. Keep up the good work!" });
      }
      
      // Generate recommendations using OpenAI
      const prompt = `Based on the student's weak areas in these topics: ${weakTopics.join(", ")}, 
        suggest specific study materials and resources. Include:
        1. Recommended textbooks or online courses
        2. Practice exercises for each topic
        3. Video tutorials or lectures
        4. Interactive learning tools
        Format the response as a JSON object.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const recommendations = JSON.parse(response.choices[0].message.content);
      
      // Cache the recommendations
      await cache.setex(`recommendations:${id}`, 3600, JSON.stringify(recommendations));
      
      return reply.send(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      return reply.status(500).send({ error: "Failed to generate recommendations" });
    }
  });
  
  // Get personalized recommendations for a student
  fastify.get("/api/recommendations/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      
      // Check cache first
      const cachedRecommendations = await cache.get(`recommendations:${id}`);
      if (cachedRecommendations) {
        return reply.send(JSON.parse(cachedRecommendations));
      }
      
      // Get student's interests and performance
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          interests: true,
          performance: true
        }
      });
      
      if (!student) {
        return reply.status(404).send({ error: "Student not found" });
      }
      
      // Generate personalized recommendations
      const interests = student.interests.map(i => i.name).join(", ");
      const weakAreas = student.performance
        .filter(p => p.score < 70)
        .map(p => p.topic)
        .join(", ");
      
      const prompt = `Based on the student's interests in ${interests} and weak areas in ${weakAreas}, 
        suggest personalized learning resources and study materials. Format as JSON.`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });
      
      const recommendations = JSON.parse(response.choices[0].message.content);
      
      // Cache the recommendations
      await cache.setex(`recommendations:${id}`, 3600, JSON.stringify(recommendations));
      
      return reply.send(recommendations);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return reply.status(500).send({ error: "Failed to fetch recommendations" });
    }
  });
  
  // Get course recommendations based on student interests
  fastify.get("/api/course-recommendations/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      
      // Check cache first
      const cachedRecommendations = await cache.get(`course-recommendations:${id}`);
      if (cachedRecommendations) {
        return reply.send(JSON.parse(cachedRecommendations));
      }
      
      // Get student's interests
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          interests: true
        }
      });
      
      if (!student) {
        return reply.status(404).send({ error: "Student not found" });
      }
      
      const interests = student.interests.map(i => i.name).join(", ");
      
      // Get all available courses
      const courses = await prisma.course.findMany();
      
      // Use TF-IDF to find relevant courses
      let recommendations = [];
      if (modelData.length > 0) {
        // Use the loaded model data
        const tfidf = new natural.TfIdf();
        modelData.forEach(doc => {
          tfidf.addDocument(doc.text);
        });
        
        // Add student interests as a query
        const query = interests;
        tfidf.addDocument(query);
        
        // Get the most similar documents
        const scores = [];
        for (let i = 0; i < tfidf.documents.length - 1; i++) {
          let score = 0;
          tfidf.tfidfs(query, i, (i, measure) => {
            score = measure;
          });
          scores.push({ index: i, score });
        }
        
        // Sort by score and get top 5
        const topIndices = scores
          .sort((a, b) => b.score - a.score)
          .slice(0, 5)
          .map(s => s.index);
        
        recommendations = topIndices.map(i => courses[i]);
      } else {
        // Fallback to OpenAI if model data is not available
        const prompt = `Based on the student's interests in ${interests}, 
          suggest 5 relevant courses from this list: ${courses.map(c => c.title).join(", ")}. 
          Format as a JSON array of course objects.`;
        
        const response = await openai.chat.completions.create({
          model: "gpt-4-turbo-preview",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        });
        
        const result = JSON.parse(response.choices[0].message.content);
        recommendations = result.courses || [];
      }
      
      // Cache the recommendations
      await cache.setex(`course-recommendations:${id}`, 3600, JSON.stringify(recommendations));
      
      return reply.send(recommendations);
    } catch (error) {
      console.error("Error fetching course recommendations:", error);
      return reply.status(500).send({ error: "Failed to fetch course recommendations" });
    }
  });
});
