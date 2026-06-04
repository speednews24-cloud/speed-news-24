import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export async function sendMail({ to, subject, html }) {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) return { skipped: true };
  const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
  });
  return transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
}
