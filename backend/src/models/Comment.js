import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
  },
  { timestamps: true }
);

export default mongoose.model('Comment', commentSchema);
