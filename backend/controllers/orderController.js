import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, payment } = req.body;

  // Validate stock and build order items
  let subtotal = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product).populate('farm');
    if (!product || !product.isActive)
      return res.status(400).json({ success: false, message: `${item.name} is no longer available` });
    if (product.quantity < item.quantity)
      return res.status(400).json({ success: false, message: `Only ${product.quantity} units of ${product.name} available` });

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    orderItems.push({
      product: product._id,
      farm:    product.farm._id,
      seller:  product.seller,
      name:    product.name,
      image:   product.images[0]?.url || '',
      price:   product.price,
      unit:    product.unit,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });

    // Deduct stock
    product.quantity -= item.quantity;
    await product.save();
  }

  const deliveryCharge = subtotal >= 300 ? 0 : 30;
  const total = subtotal + deliveryCharge;

  const order = await Order.create({
    customer: req.user._id,
    items: orderItems,
    deliveryAddress,
    payment: { method: payment.method, status: payment.method === 'cod' ? 'pending' : 'pending' },
    pricing: { subtotal, deliveryCharge, total },
    statusHistory: [{ status: 'pending', note: 'Order placed', updatedBy: req.user._id }],
    estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hrs
    deliveryOTP: Math.floor(100000 + Math.random() * 900000).toString(),
  });

  await order.populate('items.product', 'name images');
  res.status(201).json({ success: true, order });
});

// GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ customer: req.user._id })
    .sort('-createdAt')
    .populate('items.product', 'name images price');
  res.json({ success: true, orders });
});

// GET /api/orders/:id
export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('customer', 'name phone email')
    .populate('items.product', 'name images')
    .populate('items.farm', 'name slug')
    .populate('deliveryPartner', 'name phone');

  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  // Only owner, admin, or delivery partner can view
  const allowed =
    order.customer._id.toString() === req.user._id.toString() ||
    req.user.role === 'admin' ||
    order.deliveryPartner?._id.toString() === req.user._id.toString();

  if (!allowed) return res.status(403).json({ success: false, message: 'Not authorized' });

  res.json({ success: true, order });
});

// PUT /api/orders/:id/status  (admin/delivery)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.status = status;
  order.statusHistory.push({ status, note, updatedBy: req.user._id });
  if (status === 'delivered') {
    order.deliveredAt = new Date();
    order.payment.status = 'paid';
  }
  await order.save();
  res.json({ success: true, order });
});

// GET /api/orders/farmer/mine  (farmer sees orders for their products)
export const getFarmerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'items.seller': req.user._id })
    .sort('-createdAt')
    .populate('customer', 'name phone')
    .populate('items.product', 'name images');
  res.json({ success: true, orders });
});

// GET /api/orders  (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const total  = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .sort('-createdAt')
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .populate('customer', 'name phone')
    .populate('deliveryPartner', 'name');
  res.json({ success: true, total, orders });
});
