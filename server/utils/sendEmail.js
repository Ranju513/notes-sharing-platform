const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "74.125.200.108",
      port: 587,
      secure: false,
      requireTLS: true,
      tls: {
        servername: "smtp.gmail.com",
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 30000,
      greetingTimeout: 30000,
      socketTimeout: 30000,
    });

    await transporter.sendMail({
      from: `"NoteHub" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });

    console.log("✅ OTP email sent to:", to);
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};

module.exports = sendEmail;
