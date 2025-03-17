fastify.post("/set-goal", async (req, reply) => {
    const { studentId, goal } = req.body;
    const newGoal = await prisma.studyGoal.create({ data: { studentId, goal } });
    reply.send(newGoal);
  });
  
  fastify.get("/goals/:studentId", async (req, reply) => {
    const goals = await prisma.studyGoal.findMany({ where: { studentId: req.params.studentId } });
    reply.send(goals);
  });
  
  fastify.put("/update-goal/:id", async (req, reply) => {
    const updatedGoal = await prisma.studyGoal.update({
      where: { id: req.params.id },
      data: { completed: true },
    });
    reply.send(updatedGoal);
  });
  
//Students earn XP and badges dynamically
  fastify.post("/update-xp", async (req, reply) => {
    const { studentId, points, badge } = req.body;
  
    let student = await prisma.gamification.findUnique({ where: { studentId } });
  
    if (!student) {
      student = await prisma.gamification.create({
        data: { studentId, xpPoints: points, badges: badge ? [badge] : [] },
      });
    } else {
      await prisma.gamification.update({
        where: { studentId },
        data: {
          xpPoints: student.xpPoints + points,
          badges: badge ? [...student.badges, badge] : student.badges,
        },
      });
    }
  
    reply.send({ success: true });
  });