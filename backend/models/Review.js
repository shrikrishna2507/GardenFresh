import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  farm:     { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' },
  order:    { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  title:    { type: String },
  comment:  { type: String },
  images:   [{ url: String }],
  isVerifiedPurchase: { type: Boolean, default: true },
  helpfulVotes: { type: Number, default: 0 },
  reply: {
    text:      String,
    repliedAt: Date,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
}, { timestamps: true });

reviewSchema.index({ customer: 1, product: 1, order: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
