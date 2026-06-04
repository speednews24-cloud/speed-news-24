import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    sentAt: Date,
    status: { type: String, enum: ['draft', 'sent', 'failed'], default: 'draft' },
    error: String
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
