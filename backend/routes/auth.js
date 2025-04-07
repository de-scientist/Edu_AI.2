import fastifyPlugin from "fastify-plugin";
import prisma from "../prisma/db.js";
import crypto from "crypto";
import { sendResetEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default fastifyPlugin(async (fastify, opts) => {

  fastify.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body;

    // Fetch user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.status(401).send({ error: "Invalid credentials" });

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return reply.status(401).send({ error: "Invalid credentials" });

    // Generate JWT token, now including the role
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },  // Include user role in the token
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Capture user login details
    const ipAddress = req.ip || req.headers["x-forwarded-for"] || "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        ipAddress,
        userAgent,
      },
    });

    // Based on user role, send a redirect URL
    let redirectUrl = "/dashboard"; // Default dashboard
    if (user.role === "admin") {
      redirectUrl = "/admin/dashboard";
    } else if (user.role === "manager") {
      redirectUrl = "/manager/dashboard";
    }

    // Send the token, user object, and redirect URL back to the client
    reply.send({ 
      token, 
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.email,
        role: user.role
      }
    });
  });

  fastify.post("/auth/request-reset", async (req, reply) => {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(404).send({ error: "User not found" });
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1-hour expiry

    await prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpires },
    });

    await sendResetEmail(email, resetToken);
    reply.send({ message: "Password reset email sent." });
  });

  fastify.post("/auth/reset-password", async (req, reply) => {
    const { token, newPassword } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpires: { gt: new Date() } },
    });

    if (!user) {
      return reply.status(400).send({ error: "Invalid or expired token." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExpires: null },
    });

    reply.send({ message: "Password has been reset successfully." });
  });

  // Signup endpoint
  fastify.post("/api/signup", async (req, reply) => {
    try {
      const { name, email, password, role } = req.body;

      // Validate required fields
      if (!name || !email || !password) {
        return reply.status(400).send({ error: "Missing required fields" });
      }

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.status(400).send({ error: "Email already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role || "STUDENT",
        },
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Return success response
      return reply.status(201).send({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);
      return reply.status(500).send({ error: "Failed to create user" });
    }
  });

});
