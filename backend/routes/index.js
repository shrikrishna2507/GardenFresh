import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

// Controllers
import * as auth     from '../controllers/authController.js';
import * as products from '../controllers/productController.js';
import * as farms    from '../controllers/farmController.js';
import * as orders   from '../controllers/orderController.js';

const router = express.Router();

// ─── AUTH ────────────────────────────────────────────────
router.post('/auth/register',  auth.register);
router.post('/auth/login',     auth.login);
router.get ('/auth/me',        protect, auth.getMe);
router.put ('/auth/profile',   protect, upload.single('avatar'), auth.updateProfile);
router.post('/auth/wishlist/:productId', protect, auth.toggleWishlist);

// ─── FARMS ───────────────────────────────────────────────
router.get ('/farms',           farms.getFarms);
router.get ('/farms/mine',      protect, authorize('farmer'), farms.getMyFarm);
router.post('/farms',           protect, authorize('farmer'), upload.array('images', 5), farms.createFarm);
router.put ('/farms/mine',      protect, authorize('farmer'), upload.array('images', 5), farms.updateMyFarm);
router.get ('/farms/:slug',     farms.getFarm);
router.put ('/farms/:id/verify', protect, authorize('admin'), farms.verifyFarm);

// ─── PRODUCTS ────────────────────────────────────────────
router.get ('/products',          products.getProducts);
router.get ('/products/farmer/mine', protect, authorize('farmer'), products.getMyProducts);
router.get ('/products/:id',      products.getProduct);
router.post('/products',          protect, authorize('farmer'), upload.array('images', 5), products.createProduct);
router.put ('/products/:id',      protect, authorize('farmer'), upload.array('images', 5), products.updateProduct);
router.delete('/products/:id',    protect, authorize('farmer'), products.deleteProduct);

// ─── ORDERS ──────────────────────────────────────────────
router.post('/orders',            protect, orders.createOrder);
router.get ('/orders/mine',       protect, orders.getMyOrders);
router.get ('/orders/farmer/mine',protect, authorize('farmer'), orders.getFarmerOrders);
router.get ('/orders',            protect, authorize('admin', 'delivery'), orders.getAllOrders);
router.get ('/orders/:id',        protect, orders.getOrder);
router.put ('/orders/:id/status', protect, authorize('admin', 'delivery'), orders.updateOrderStatus);

export default router;
