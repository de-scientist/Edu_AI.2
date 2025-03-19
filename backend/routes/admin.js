export default async function adminRoutes(fastify, options) {
    // Create a new user
    fastify.post("/admin/users/create", async (request, reply) => {
      const { name, email, password, role } = request.body;
  
      await prisma.user.create({
        data: { name, email, password, role }
      });
  
      return { message: "User created successfully!" };
    });
  
    // List all users
    fastify.get("/admin/users", async (request, reply) => {
      const users = await prisma.user.findMany();
      return users;
    });

    fastify.get("/admin/user-logs", async (req, reply) => {
      // Check if the requester is an admin (implement role-based auth later)
      const logs = await prisma.loginHistory.findMany({
        include: { user: { select: { email: true } } },
        orderBy: { timestamp: "desc" },
      });
  
      reply.send(logs);
    });

    fastify.get("/admin/user-logs2", async (req, reply) => {
      const { authorization } = req.headers;
      if (!authorization) return reply.status(403).send({ error: "No token provided" });
  
      try {
        const decoded = jwt.verify(authorization.split(" ")[1], process.env.JWT_SECRET);
        const admin = await prisma.user.findUnique({ where: { id: decoded.userId } });
  
        if (!admin || admin.role !== "admin") {
          return reply.status(403).send({ error: "Access denied" });
        }
  
        const logs = await prisma.loginHistory.findMany({
          include: { user: { select: { email: true } } },
          orderBy: { timestamp: "desc" },
        });
  
        reply.send(logs);
      } catch (err) {
        return reply.status(401).send({ error: "Invalid token" });
      }
    });

  }
  
