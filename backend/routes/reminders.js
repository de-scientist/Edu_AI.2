const fastify = require("fastify")();
const { PrismaClient } = require("@prisma/client");
const nodemailer = require("nodemailer");
const twilio = require("twilio");

const prisma = new PrismaClient();
const transporter = nodemailer.createTransport({ service: "gmail", auth: { user: "your-email@gmail.com", pass: "your-password" } });
const twilioClient = twilio("TWILIO_SID", "TWILIO_AUTH_TOKEN");

fastify.post("/set-reminder", async (req, reply) => {
  const { studentId, message, sendTime } = req.body;
  const reminder = await prisma.reminder.create({ data: { studentId, message, sendTime } });
  reply.send(reminder);
});

fastify.get("/send-reminders", async (_, reply) => {
  const reminders = await prisma.reminder.findMany({ where: { sent: false, sendTime: { lte: new Date() } } });

  for (const r of reminders) {
    const student = await prisma.student.findUnique({ where: { id: r.studentId } });

    if (student.email) {
      await transporter.sendMail({ from: "your-email@gmail.com", to: student.email, subject: "Study Reminder", text: r.message });
    }
    if (student.phone) {
      await twilioClient.messages.create({ body: r.message, from: "+1234567890", to: student.phone });
    }

    await prisma.reminder.update({ where: { id: r.id }, data: { sent: true } });
  }

  reply.send({ message: "Reminders sent!" });
});
