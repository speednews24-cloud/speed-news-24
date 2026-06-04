import { body } from 'express-validator';
import Comment from '../models/Comment.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const commentRules = [body('article').isMongoId(), body('body').trim().isLength({ min: 2, max: 2000 })];

export const listComments = asyncHandler(async (req, res) => {
  const filter = { article: req.query.article, status: 'approved' };
  res.json(await Comment.find(filter).populate('user', 'name').sort({ createdAt: -1 }));
});

export const createComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({ article: req.body.article, body: req.body.body, parent: req.body.parent, user: req.user._id });
  res.status(201).json(comment);
});

export const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw Object.assign(new Error('Comment not found'), { statusCode: 404 });
  const userId = req.user._id.toString();
  comment.likes = comment.likes.some((id) => id.toString() === userId)
    ? comment.likes.filter((id) => id.toString() !== userId)
    : [...comment.likes, req.user._id];
  await comment.save();
  res.json(comment);
});

export const moderateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  if (!comment) throw Object.assign(new Error('Comment not found'), { statusCode: 404 });
  res.json(comment);
});
