const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendPasswordResetEmail(toEmail, resetUrl) {
  await transporter.sendMail({
    from: `"Samagama FAQ" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password. This link expires in 10 minutes.</p>
      <a href="${resetUrl}" style="background:#6366f1;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;display:inline-block;margin-top:12px;">Reset Password</a>
      <p style="margin-top:16px;color:#64748b;font-size:13px;">If you didn't request this, ignore this email.</p>
    `,
  });
}

module.exports = { sendPasswordResetEmail };