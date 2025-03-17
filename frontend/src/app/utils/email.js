import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail", // Use Gmail, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,  // Set in .env
    pass: process.env.EMAIL_PASS,  // Set in .env
  },
});

export const sendResetEmail = async (email, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    text: `Click the link to reset your password: ${resetLink}`,
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
