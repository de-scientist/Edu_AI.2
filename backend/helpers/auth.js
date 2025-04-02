import bcrypt from "bcryptjs";

/**
 * Hash a password using bcrypt
 * @param {string} password - The plain text password
 * @returns {Promise<string>} - The hashed password
 */
export async function hashPassword(password) {
  if (!password) throw new Error("Password is required");
  return await bcrypt.hash(password, 12); // Increased salt rounds for better security
}

/**
 * Compare a plain password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hashedPassword - The stored hashed password
 * @returns {Promise<boolean>} - Whether the passwords match
 */
export async function comparePassword(password, hashedPassword) {
  if (!password || !hashedPassword) throw new Error("Both password and hashed password are required");
  return await bcrypt.compare(password, hashedPassword);
}

/**
 * JWT Authentication Middleware
 * @param {object} fastify - Fastify instance
 * @returns {function} - Middleware function to verify JWT
 */
export function authenticate(fastify) {
  return async (req, reply) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.status(401).send({ error: "Unauthorized", message: err.message });
    }
  };
}
