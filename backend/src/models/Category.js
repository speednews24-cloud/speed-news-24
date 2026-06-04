import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    language: { type: String, enum: ['en', 'hi', 'both'], default: 'both' },
    description: String,
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
