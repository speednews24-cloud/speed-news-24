import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import User from '../models/User.js';

export async function requireAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies.accessToken;
    if (!token) throw Object.assign(new Error('Authentication required'), { statusCode: 401 });
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).select('-passwordHash -refreshTokens');
    if (!user || !user.isActive) throw Object.assign(new Error('Invalid session'), { statusCode: 401 });
    req.user = user;
    next();
  } catch (error) {
    error.statusCode = error.statusCode || 401;
    next(error);
  }
}

export const allowRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) return next(Object.assign(new Error('Forbidden'), { statusCode: 403 }));
  next();
};
