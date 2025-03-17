import fastifyPlugin from "fastify-plugin";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { sendResetEmail } from "../utils/email.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default fastifyPlugin(async (fastify, opts) => {

  fastify.post("/auth/login", async (req, reply) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return reply.status(401).send({ error: "Invalid credentials" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return reply.status(401).send({ error: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

    reply.send({ token });
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

});
