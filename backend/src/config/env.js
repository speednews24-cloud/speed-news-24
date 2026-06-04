import dotenv from 'dotenv';

dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:5000/api',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || '7d',
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS || 12),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  GNEWS_API_KEY: process.env.GNEWS_API_KEY,
  UNSPLASH_ACCESS_KEY: process.env.UNSPLASH_ACCESS_KEY,
  PEXELS_API_KEY: process.env.PEXELS_API_KEY,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM || 'Speed News 24 <news@speednews24.com>',
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  DNS_SERVERS: process.env.DNS_SERVERS,
  ESTIMATED_AD_RPM_INR: Number(process.env.ESTIMATED_AD_RPM_INR || 120)
};
