
import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use SMTP
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or App password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendEmail;
