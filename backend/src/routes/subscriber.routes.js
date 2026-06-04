import { Router } from 'express';
import { subscribe, subscribeRules } from '../controllers/subscriber.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/subscribe', subscribeRules, validate, subscribe);
router.post('/', subscribeRules, validate, subscribe);

export default router;
