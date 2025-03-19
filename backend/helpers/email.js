import nodemailer from "nodemailer";

// Email transporter setup using Gmail SMTP
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send an email
export async function sendEmail(to, subject, text) {
  return transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, text });
}
