export default async function interactionRoutes(fastify, options) {
    // Send a message
    fastify.post("/interactions/message", async (request, reply) => {
      const { userId, lecturerId, message } = request.body;
  
      await prisma.interaction.create({
        data: { userId, lecturerId, message }
      });
  
      return { message: "Message sent successfully!" };
    });
  
    // Retrieve messages between a student & lecturer
    fastify.get("/interactions/:userId/:lecturerId", async (request, reply) => {
      const { userId, lecturerId } = request.params;
  
      const messages = await prisma.interaction.findMany({
        where: { userId, lecturerId },
        orderBy: { timestamp: "desc" }
      });
  
      return messages;
    });
  }
  