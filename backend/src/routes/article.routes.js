import { Router } from 'express';
import { createArticle, deleteArticle, getArticle, listArticles, updateArticle, articleRules } from '../controllers/article.controller.js';
import { allowRoles, requireAuth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.get('/', listArticles);
router.get('/article/:slug', getArticle);
router.get('/:slug', getArticle);
router.post('/', requireAuth, allowRoles('admin', 'editor'), articleRules, validate, createArticle);
router.patch('/:id', requireAuth, allowRoles('admin', 'editor'), updateArticle);
router.delete('/:id', requireAuth, allowRoles('admin'), deleteArticle);

export default router;
