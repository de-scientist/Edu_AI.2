import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Course routes
 * @param {import('fastify').FastifyInstance} fastify - Fastify instance
 */
export default async function courseRoutes(fastify, options) {
  // Get all courses
  fastify.get("/api/courses", {
    handler: async (request, reply) => {
      try {
        const courses = await prisma.course.findMany();
        return courses;
      } catch (error) {
        console.error("Error fetching courses:", error);
        reply.status(500).send({ error: "Failed to fetch courses" });
      }
    }
  });

  // Get a specific course by ID
  fastify.get("/api/courses/:id", {
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const course = await prisma.course.findUnique({
          where: { id }
        });

        if (!course) {
          return reply.status(404).send({ error: "Course not found" });
        }

        return course;
      } catch (error) {
        console.error("Error fetching course:", error);
        reply.status(500).send({ error: "Failed to fetch course" });
      }
    }
  });

  // Create a new course
  fastify.post("/api/courses", {
    handler: async (request, reply) => {
      try {
        const { title, description, platform, url, instructor, duration, level, category, thumbnail } = request.body;

        const course = await prisma.course.create({
          data: {
            title,
            description,
            platform,
            url,
            instructor,
            duration,
            level,
            category,
            thumbnail
          }
        });

        return course;
      } catch (error) {
        console.error("Error creating course:", error);
        reply.status(500).send({ error: "Failed to create course" });
      }
    }
  });

  // Update a course
  fastify.put("/api/courses/:id", {
    handler: async (request, reply) => {
      try {
        const { id } = request.params;
        const { title, description, platform, url, instructor, duration, level, category, thumbnail } = request.body;

        const course = await prisma.course.update({
          where: { id },
          data: {
            title,
            description,
            platform,
            url,
            instructor,
            duration,
            level,
            category,
            thumbnail
          }
        });

        return course;
      } catch (error) {
        console.error("Error updating course:", error);
        reply.status(500).send({ error: "Failed to update course" });
      }
    }
  });

  // Delete a course
  fastify.delete("/api/courses/:id", {
    handler: async (request, reply) => {
      try {
        const { id } = request.params;

        await prisma.course.delete({
          where: { id }
        });

        return { message: "Course deleted successfully" };
      } catch (error) {
        console.error("Error deleting course:", error);
        reply.status(500).send({ error: "Failed to delete course" });
      }
    }
  });

  // Get recommended courses
  fastify.get("/api/courses/recommended", {
    handler: async (request, reply) => {
      try {
        // Get all courses
        const allCourses = await prisma.course.findMany();

        // Simple recommendation logic - can be enhanced with AI
        const recommendedCourses = allCourses.slice(0, 5); // Just return first 5 courses for now

        return recommendedCourses;
      } catch (error) {
        console.error("Error getting recommended courses:", error);
        reply.status(500).send({ error: "Failed to get recommended courses" });
      }
    }
  });
}