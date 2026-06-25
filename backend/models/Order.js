import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  farm:     { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  seller:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:     String,
  image:    String,
  price:    Number,
  unit:     String,
  quantity: Number,
  subtotal: Number,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  deliveryAddress: {
    name:    String,
    phone:   String,
    line1:   String,
    city:    String,
    state:   String,
    pincode: String,
    coordinates: { lat: Number, lng: Number },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'quality_check', 'picked_up', 'in_transit', 'delivered', 'cancelled', 'refunded'],
    default: 'pending',
  },
  statusHistory: [{
    status:    String,
    note:      String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now },
  }],
  payment: {
    method:       { type: String, enum: ['cod', 'razorpay', 'upi'] },
    status:       { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
    razorpayOrderId:   String,
    razorpayPaymentId: String,
    paidAt:       Date,
  },
  pricing: {
    subtotal:         Number,
    deliveryCharge:   { type: Number, default: 0 },
    discount:         { type: Number, default: 0 },
    platformFee:      { type: Number, default: 0 },
    total:            Number,
  },
  deliveryPartner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryOTP:     { type: String },
  estimatedDelivery: Date,
  deliveredAt:     Date,
  qualityVerified: { type: Boolean, default: false },
  qualityNotes:    String,
  cancelReason:    String,
}, { timestamps: true });

// Auto-generate orderId
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `GF${Date.now().toString().slice(-6)}${count + 1}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
