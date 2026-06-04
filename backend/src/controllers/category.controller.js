import { body } from 'express-validator';
import Category from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { makeSlug } from '../utils/slug.js';

export const categoryRules = [body('name').trim().isLength({ min: 2 })];

export const listCategories = asyncHandler(async (_req, res) => {
  res.json(await Category.find({ isActive: true }).sort({ order: 1, name: 1 }));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({ ...req.body, slug: req.body.slug || makeSlug(req.body.name) });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw Object.assign(new Error('Category not found'), { statusCode: 404 });
  res.json(category);
});
