import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String },
  farmType: {
    type: String,
    enum: ['home_garden', 'terrace_garden', 'small_farm', 'community_garden'],
    default: 'home_garden',
  },
  images: [{ url: String, publicId: String }],
  coverImage: { url: String, publicId: String },
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number], // [longitude, latitude]
    },
  },
  isVerified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  isNaturallyGrown: { type: Boolean, default: false },
  isOrganic: { type: Boolean, default: false },
  certifications: [String],
  practicesSummary: { type: String },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  totalSales: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    upiId: String,
  },
  commissionRate: { type: Number, default: 10 }, // percentage
}, { timestamps: true });

farmSchema.index({ 'location.coordinates': '2dsphere' });

// Auto-generate slug
farmSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  next();
});

export default mongoose.model('Farm', farmSchema);
