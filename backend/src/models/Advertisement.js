import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    placement: { type: String, enum: ['header', 'sidebar', 'between_articles', 'footer'], required: true, index: true },
    code: String,
    imageUrl: String,
    targetUrl: String,
    sponsorName: String,
    startsAt: Date,
    endsAt: Date,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Advertisement', adSchema);
