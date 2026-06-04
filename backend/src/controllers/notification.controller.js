import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendTopicNotification } from '../services/pushService.js';

export const sendNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.create({ ...req.body, status: 'draft' });
  try {
    await sendTopicNotification(req.body.topic || 'breaking-news', {
      title: notification.title,
      body: notification.body,
      data: { articleId: notification.article?.toString() || '' }
    });
    notification.status = 'sent';
    notification.sentAt = new Date();
  } catch (error) {
    notification.status = 'failed';
    notification.error = error.message;
  }
  await notification.save();
  res.status(201).json(notification);
});
