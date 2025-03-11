export default async function progressRoutes(fastify, options) {
    // Update a user's course progress
    fastify.post("/progress/update", async (request, reply) => {
      const { userId, courseId, progress } = request.body;
  
      // Ensure progress doesn't exceed 100%
      const updatedProgress = progress > 100 ? 100 : progress;
  
      await prisma.progress.upsert({
        where: { userId_courseId: { userId, courseId } },
        update: { progress: updatedProgress },
        create: { userId, courseId, progress: updatedProgress }
      });
  
      return { message: "Progress updated successfully!" };
    });
  }
  