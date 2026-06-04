import { Router } from 'express';
import { createComment, likeComment, listComments, moderateComment, commentRules } from '../controllers/comment.controller.js';
import { allowRoles, requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', listComments);
router.post('/', requireAuth, commentRules, validate, createComment);
router.post('/:id/like', requireAuth, likeComment);
router.patch('/:id/moderate', requireAuth, allowRoles('admin', 'editor'), moderateComment);

export default router;
