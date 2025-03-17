fastify.get("/achievements/:studentId", async (req, reply) => {
    const { studentId } = req.params;
  
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { achievements: true },
    });
  
    if (!student) return reply.status(404).send({ error: "Student not found" });
  
    reply.send(student.achievements);
  });
  