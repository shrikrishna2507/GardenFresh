import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String },
  description: { type: String },
  category: {
    type: String,
    enum: ['vegetables', 'fruits', 'herbs', 'nuts', 'greens', 'exotic', 'seasonal'],
    required: true,
  },
  subcategory: { type: String },
  images: [{ url: String, publicId: String }],
  price: { type: Number, required: true },
  unit: { type: String, required: true }, // '500g', '1kg', 'bunch', 'piece'
  quantity: { type: Number, required: true, default: 0 }, // available stock
  minOrder: { type: Number, default: 1 },
  harvestDate: { type: Date },
  expiryDate: { type: Date },
  isFreshToday: { type: Boolean, default: false },
  isNaturallyGrown: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  isPesticide: { type: Boolean, default: true }, // false = pesticide-free
  growingPractices: { type: String },
  nutritionInfo: { type: String },
  tags: [String],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSold: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  discount: { type: Number, default: 0 }, // percentage
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });

productSchema.virtual('discountedPrice').get(function () {
  return this.discount > 0
    ? +(this.price * (1 - this.discount / 100)).toFixed(2)
    : this.price;
});

productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }
  next();
});

export default mongoose.model('Product', productSchema);
