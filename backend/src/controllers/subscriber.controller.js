import { body } from 'express-validator';
import Subscriber from '../models/Subscriber.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const subscribeRules = [body('email').isEmail().normalizeEmail()];

export const subscribe = asyncHandler(async (req, res) => {
  const subscriber = await Subscriber.findOneAndUpdate(
    { email: req.body.email },
    { $set: { language: req.body.language || 'en', categories: req.body.categories || [], isActive: true } },
    { new: true, upsert: true }
  );
  res.status(201).json(subscriber);
});
