import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

export default async function adminRoutes(fastify, options) {
    // Create a new user
    fastify.post("/api/admin/users/create", { preHandler: authenticate }, async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }
        
        const { name, email, password, role } = request.body;
  
        await prisma.user.create({
          data: { name, email, password, role }
        });
  
        return reply.send({ message: "User created successfully!" });
      } catch (error) {
        console.error("Error creating user:", error);
        return reply.status(500).send({ error: "Failed to create user" });
      }
    });
  
    // List all users
    fastify.get("/api/admin/users", { preHandler: authenticate }, async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }
        
        const users = await prisma.user.findMany();
        return reply.send(users);
      } catch (error) {
        console.error("Error fetching users:", error);
        return reply.status(500).send({ error: "Failed to fetch users" });
      }
    });

    fastify.get("/api/admin/user-logs", { preHandler: authenticate }, async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }
        
        const logs = await prisma.loginHistory.findMany({
          include: { user: { select: { email: true } } },
          orderBy: { timestamp: "desc" },
        });
  
        return reply.send(logs);
      } catch (error) {
        console.error("Error fetching user logs:", error);
        return reply.status(500).send({ error: "Failed to fetch user logs" });
      }
    });

    fastify.get("/api/admin/user-logs2", { preHandler: authenticate }, async (request, reply) => {
      try {
        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }
        
        const logs = await prisma.loginHistory.findMany({
          include: { user: { select: { email: true } } },
          orderBy: { timestamp: "desc" },
        });
  
        return reply.send(logs);
      } catch (error) {
        console.error("Error fetching user logs:", error);
        return reply.status(500).send({ error: "Failed to fetch user logs" });
      }
    });
}
  
