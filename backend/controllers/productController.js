import Product from '../models/Product.js';
import Farm from '../models/Farm.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// GET /api/products  — search + filter + pagination
export const getProducts = asyncHandler(async (req, res) => {
  const {
    search, category, farmId, minPrice, maxPrice,
    isOrganic, isFreshToday, isNaturallyGrown,
    sort = '-createdAt', page = 1, limit = 20,
    lat, lng, radius = 10, // km
  } = req.query;

  const query = { isActive: true, quantity: { $gt: 0 } };

  if (search)          query.$text = { $search: search };
  if (category)        query.category = category;
  if (farmId)          query.farm = farmId;
  if (isOrganic)       query.isOrganic = true;
  if (isFreshToday)    query.isFreshToday = true;
  if (isNaturallyGrown) query.isNaturallyGrown = true;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = +minPrice;
    if (maxPrice) query.price.$lte = +maxPrice;
  }

  const skip  = (+page - 1) * +limit;
  const total = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate('farm', 'name slug location isVerified isNaturallyGrown rating totalReviews images')
    .populate('seller', 'name avatar')
    .sort(sort)
    .skip(skip)
    .limit(+limit)
    .lean();

  res.json({
    success: true,
    total,
    page: +page,
    pages: Math.ceil(total / +limit),
    products,
  });
});

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('farm', 'name slug location isVerified isOrganic isNaturallyGrown rating totalReviews images description farmType')
    .populate('seller', 'name avatar');

  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  // Find same product from other farms
  const alternatives = await Product.find({
    name: { $regex: product.name, $options: 'i' },
    _id: { $ne: product._id },
    isActive: true,
    quantity: { $gt: 0 },
  })
    .populate('farm', 'name slug rating isVerified isNaturallyGrown location')
    .limit(5)
    .lean();

  res.json({ success: true, product, alternatives });
});

// POST /api/products  (farmer only)
export const createProduct = asyncHandler(async (req, res) => {
  const farm = await Farm.findOne({ owner: req.user._id });
  if (!farm) return res.status(400).json({ success: false, message: 'Create a farm profile first' });

  const images = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];

  const product = await Product.create({
    ...req.body,
    farm: farm._id,
    seller: req.user._id,
    images,
    isNaturallyGrown: farm.isNaturallyGrown,
  });

  res.status(201).json({ success: true, product });
});

// PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, seller: req.user._id });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

  Object.assign(product, req.body);
  if (req.files?.length) {
    product.images = req.files.map(f => ({ url: f.path, publicId: f.filename }));
  }
  await product.save();
  res.json({ success: true, product });
});

// DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete({ _id: req.params.id, seller: req.user._id });
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, message: 'Product removed' });
});

// GET /api/products/farmer/mine
export const getMyProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ seller: req.user._id })
    .populate('farm', 'name')
    .sort('-createdAt');
  res.json({ success: true, products });
});
