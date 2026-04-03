import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config(); 


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,     
    pass: process.env.EMAIL_PASS, 
  },
});

export const sendPasswordResetEmail = async (toEmail, username, newPassword) => {
  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Your Password Has Been Reset",
    html: `
      <p>Hi <strong>${username}</strong>,</p>
      <p>Your password has been reset by the admin.</p>
      <p>Your new password is: <strong>${newPassword}</strong></p>
      <p>Please log in and change your password immediately.</p>
    `,
  });
};