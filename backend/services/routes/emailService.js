const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-password",
  },
});

async function sendAlertEmail(studentId, adminEmail) {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: adminEmail,
    subject: `⚠️ Low Progress Alert - Student ${studentId}`,
    text: `Student ${studentId} has dropped below 40% progress. Please check in with them.`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 Alert sent to ${adminEmail}`);
}

module.exports = { sendAlertEmail };
