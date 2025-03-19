import bcrypt from "bcryptjs";

// Function to hash password
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Function to compare passwords
export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

// JWT Authentication Middleware
export function authenticate(fastify) {
  return async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized" });
    }
  };
}
