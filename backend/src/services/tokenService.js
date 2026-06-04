import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL });
}

export function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString(), type: 'refresh' }, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TOKEN_TTL });
}

export const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');
