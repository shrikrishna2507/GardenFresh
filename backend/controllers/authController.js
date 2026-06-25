import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

  const allowedRoles = ['customer', 'farmer', 'delivery'];
  const userRole = allowedRoles.includes(role) ? role : 'customer';

  const user = await User.create({ name, email, password, phone, role: userRole });

  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    token: generateToken(user._id),
    user: user.toPublicJSON(),
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password required' });

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid email or password' });

  if (!user.isActive)
    return res.status(403).json({ success: false, message: 'Account suspended. Contact support.' });

  res.json({
    success: true,
    token: generateToken(user._id),
    user: user.toPublicJSON(),
  });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images price farm');
  res.json({ success: true, user: user.toPublicJSON() });
});

// PUT /api/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, addresses } = req.body;
  const user = await User.findById(req.user._id);
  if (name)      user.name      = name;
  if (phone)     user.phone     = phone;
  if (addresses) user.addresses = addresses;
  if (req.file)  user.avatar    = req.file.path;
  await user.save();
  res.json({ success: true, user: user.toPublicJSON() });
});

// POST /api/auth/wishlist/:productId
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const pid  = req.params.productId;
  const idx  = user.wishlist.indexOf(pid);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else          user.wishlist.push(pid);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist, added: idx === -1 });
});
