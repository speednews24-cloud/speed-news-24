import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'editor', 'user'], default: 'user', index: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    refreshTokens: [{ tokenHash: String, createdAt: { type: Date, default: Date.now } }]
  },
  { timestamps: true }
);

userSchema.methods.setPassword = async function setPassword(password) {
  this.passwordHash = await bcrypt.hash(password, env.BCRYPT_ROUNDS);
};

userSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model('User', userSchema);
