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
  }
  