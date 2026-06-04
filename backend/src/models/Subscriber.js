import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    language: { type: String, enum: ['en', 'hi'], default: 'en' },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('Subscriber', subscriberSchema);
