import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { hashToken, signAccessToken, signRefreshToken } from '../services/tokenService.js';
import { sendMail } from '../services/mailService.js';

export const registerRules = [
  body('name').trim().isLength({ min: 2 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
];

function authPayload(user, refreshToken) {
  return {
    accessToken: signAccessToken(user),
    refreshToken,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, isEmailVerified: user.isEmailVerified }
  };
}

export const register = asyncHandler(async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) throw Object.assign(new Error('Email is already registered'), { statusCode: 409 });
  const user = new User({ name: req.body.name, email: req.body.email, role: req.body.role === 'admin' ? 'user' : req.body.role || 'user' });
  await user.setPassword(req.body.password);
  user.emailVerificationToken = crypto.randomBytes(24).toString('hex');
  const refreshToken = signRefreshToken(user);
  user.refreshTokens.push({ tokenHash: hashToken(refreshToken) });
  await user.save();
  await sendMail({
    to: user.email,
    subject: 'Verify your Speed News 24 account',
    html: `<p>Use this verification token: <strong>${user.emailVerificationToken}</strong></p>`
  });
  res.status(201).json(authPayload(user, refreshToken));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password))) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }
  const refreshToken = signRefreshToken(user);
  user.refreshTokens.push({ tokenHash: hashToken(refreshToken) });
  await user.save();
  res.json(authPayload(user, refreshToken));
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken || req.cookies.refreshToken;
  if (!token) throw Object.assign(new Error('Refresh token required'), { statusCode: 401 });
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  const user = await User.findById(payload.sub);
  if (!user || !user.refreshTokens.some((entry) => entry.tokenHash === hashToken(token))) {
    throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
  }
  res.json({ accessToken: signAccessToken(user) });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ emailVerificationToken: req.body.token });
  if (!user) throw Object.assign(new Error('Invalid verification token'), { statusCode: 400 });
  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  res.json({ message: 'Email verified' });
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    user.resetPasswordToken = crypto.randomBytes(24).toString('hex');
    user.resetPasswordExpires = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    await sendMail({ to: user.email, subject: 'Reset Speed News 24 password', html: `<p>Reset token: ${user.resetPasswordToken}</p>` });
  }
  res.json({ message: 'If the email exists, a reset message has been sent' });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: new Date() } });
  if (!user) throw Object.assign(new Error('Invalid or expired reset token'), { statusCode: 400 });
  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  user.refreshTokens = [];
  await user.save();
  res.json({ message: 'Password reset complete' });
});
