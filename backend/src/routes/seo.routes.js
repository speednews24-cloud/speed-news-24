import { Router } from 'express';
import { robots, sitemap } from '../controllers/seo.controller.js';

const router = Router();

router.get('/sitemap.xml', sitemap);
router.get('/robots.txt', robots);

export default router;
