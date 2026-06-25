import Farm from '../models/Farm.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/farms
export const getFarms = asyncHandler(async (req, res) => {
  const { city, isVerified, isOrganic, sort = '-rating', page = 1, limit = 12 } = req.query;
  const query = { isActive: true };
  if (city)       query['location.city'] = new RegExp(city, 'i');
  if (isVerified) query.isVerified = true;
  if (isOrganic)  query.isOrganic = true;

  const total = await Farm.countDocuments(query);
  const farms = await Farm.find(query)
    .populate('owner', 'name avatar')
    .sort(sort)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .lean();

  res.json({ success: true, total, farms });
});

// GET /api/farms/:slug
export const getFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ slug: req.params.slug })
    .populate('owner', 'name avatar phone');
  if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });

  const products = await Product.find({ farm: farm._id, isActive: true, quantity: { $gt: 0 } })
    .sort('-createdAt').limit(20);

  res.json({ success: true, farm, products });
});

// POST /api/farms  (farmer only)
export const createFarm = asyncHandler(async (req, res) => {
  const existing = await Farm.findOne({ owner: req.user._id });
  if (existing) return res.status(400).json({ success: false, message: 'You already have a farm profile' });

  const images = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
  const farm = await Farm.create({ ...req.body, owner: req.user._id, images });
  res.status(201).json({ success: true, farm });
});

// PUT /api/farms/mine
export const updateMyFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ owner: req.user._id });
  if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
  Object.assign(farm, req.body);
  if (req.files?.length) farm.images = req.files.map(f => ({ url: f.path, publicId: f.filename }));
  await farm.save();
  res.json({ success: true, farm });
});

// GET /api/farms/mine
export const getMyFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ owner: req.user._id });
  if (!farm) return res.status(404).json({ success: false, message: 'No farm profile yet' });
  res.json({ success: true, farm });
});

// Admin: verify farm
export const verifyFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findByIdAndUpdate(
    req.params.id,
    { isVerified: true, verifiedAt: new Date() },
    { new: true }
  );
  res.json({ success: true, farm });
});
