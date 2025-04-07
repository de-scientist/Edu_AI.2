import fastifyPlugin from "fastify-plugin";
import prisma from "../prisma/db.js";
import { authenticate } from "../middleware/auth.js";

export default fastifyPlugin(async (fastify, opts) => {
  // Get all resources
  fastify.get("/eduai/resources", async (request, reply) => {
    try {
      const resources = await prisma.resource.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      return reply.send({ resources });
    } catch (error) {
      console.error("Error fetching resources:", error);
      return reply.status(500).send({ error: "Failed to fetch resources" });
    }
  });

  // Get resource by ID
  fastify.get("/eduai/resources/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const resource = await prisma.resource.findUnique({
        where: { id },
      });

      if (!resource) {
        return reply.status(404).send({ error: "Resource not found" });
      }

      return reply.send(resource);
    } catch (error) {
      console.error("Error fetching resource:", error);
      return reply.status(500).send({ error: "Failed to fetch resource" });
    }
  });

  // Create new resource (admin only)
  fastify.post(
    "/eduai/resources",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { title, description, type, url, category, thumbnail } = request.body;

        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }

        const resource = await prisma.resource.create({
          data: {
            title,
            description,
            type,
            url,
            category,
            thumbnail,
          },
        });

        return reply.status(201).send(resource);
      } catch (error) {
        console.error("Error creating resource:", error);
        return reply.status(500).send({ error: "Failed to create resource" });
      }
    }
  );

  // Update resource (admin only)
  fastify.put(
    "/eduai/resources/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { title, description, type, url, category, thumbnail } = request.body;

        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }

        const resource = await prisma.resource.update({
          where: { id },
          data: {
            title,
            description,
            type,
            url,
            category,
            thumbnail,
          },
        });

        return reply.send(resource);
      } catch (error) {
        console.error("Error updating resource:", error);
        return reply.status(500).send({ error: "Failed to update resource" });
      }
    }
  );

  // Delete resource (admin only)
  fastify.delete(
    "/eduai/resources/:id",
    { preHandler: authenticate },
    async (request, reply) => {
      try {
        const { id } = request.params;

        // Check if user is admin
        if (request.user.role !== "admin") {
          return reply.status(403).send({ error: "Unauthorized" });
        }

        await prisma.resource.delete({
          where: { id },
        });

        return reply.status(204).send();
      } catch (error) {
        console.error("Error deleting resource:", error);
        return reply.status(500).send({ error: "Failed to delete resource" });
      }
    }
  );
}); 