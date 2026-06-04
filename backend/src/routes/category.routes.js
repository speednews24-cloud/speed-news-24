import { Router } from 'express';
import { createCategory, listCategories, updateCategory, categoryRules } from '../controllers/category.controller.js';
import { allowRoles, requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', listCategories);
router.post('/', requireAuth, allowRoles('admin', 'editor'), categoryRules, validate, createCategory);
router.patch('/:id', requireAuth, allowRoles('admin', 'editor'), updateCategory);

export default router;
