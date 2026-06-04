import { Router } from 'express';
import { sendNotification } from '../controllers/notification.controller.js';
import { allowRoles, requireAuth } from '../middlewares/auth.js';

const router = Router();

router.post('/', requireAuth, allowRoles('admin', 'editor'), sendNotification);

export default router;
