import { Router } from 'express';
import { analytics, createAd, listAds, triggerAggregation, updateAd } from '../controllers/admin.controller.js';
import { allowRoles, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.use(requireAuth, allowRoles('admin', 'editor'));
router.get('/analytics', analytics);
router.post('/aggregate-news', triggerAggregation);
router.get('/ads', listAds);
router.post('/ads', createAd);
router.patch('/ads/:id', updateAd);

export default router;
