import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  phone: { type: String },
  role: { type: String, enum: ['customer', 'farmer', 'admin', 'delivery'], default: 'customer' },
  avatar: { type: String, default: '' },
  googleId: { type: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  addresses: [{
    label: String,
    line1: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
    coordinates: {
      lat: Number,
      lng: Number,
    },
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  notificationPrefs: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
  },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model('User', userSchema);
