# 🌿 GardenFresh — Hyperlocal Farm-to-Home Marketplace

> Connect home growers and small-scale farmers directly with nearby customers.

---

## 📁 Project Structure

```
GardenFresh/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   ├── db.js             # MongoDB connection
│   │   └── cloudinary.js     # Image upload config
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── farmController.js
│   │   └── orderController.js
│   ├── middleware/
│   │   ├── auth.js           # JWT protect + role guards
│   │   └── errorHandler.js
│   ├── models/               # MongoDB schemas
│   │   ├── User.js
│   │   ├── Farm.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Review.js
│   ├── routes/
│   │   └── index.js          # All API routes
│   ├── utils/
│   │   └── seed.js           # Demo data seeder
│   ├── .env.example
│   └── server.js             # Express entry point
│
└── frontend/                 # React + Vite + Tailwind CSS
    └── src/
        ├── components/
        │   ├── common/       # Spinner, StarRating
        │   ├── layout/       # Navbar, Footer, Layout
        │   ├── marketplace/  # ProductCard
        │   └── farm/         # FarmCard
        ├── context/
        │   ├── AuthContext.jsx
        │   └── CartContext.jsx
        ├── pages/
        │   ├── Landing.jsx
        │   ├── AboutUs.jsx
        │   ├── Contact.jsx
        │   ├── NotFound.jsx
        │   ├── auth/         # Login, Register
        │   ├── customer/     # Marketplace, ProductDetail, FarmProfile, Cart, Checkout, OrderSuccess, CustomerDashboard
        │   ├── farmer/       # FarmerDashboard, FarmerProducts, FarmerOrders, FarmSetup
        │   ├── admin/        # AdminDashboard
        │   └── delivery/     # DeliveryDashboard
        ├── services/
        │   └── api.js        # Axios + all API calls
        └── App.jsx           # Routes
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for images)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd GardenFresh
npm run install:all
```

### 2. Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your values:
# MONGO_URI, JWT_SECRET, CLOUDINARY_*, RAZORPAY_*
```

### 3. Seed Demo Data
```bash
npm run seed
```
This creates:
| Role     | Email                        | Password      |
|----------|------------------------------|---------------|
| Admin    | admin@gardenfresh.com        | Admin@123     |
| Farmer 1 | krishna@gardenfresh.com      | Farmer@123    |
| Farmer 2 | sumansa@gardenfresh.com      | Farmer@123    |
| Customer | rahul@gardenfresh.com        | Customer@123  |

### 4. Run Development Servers
```bash
# From project root — starts both backend (5000) and frontend (5173)
npm run dev
```

Open: http://localhost:5173

---

## 🗄️ Database Schema

### User
```
name, email, password (hashed), phone, role (customer|farmer|admin|delivery),
avatar, googleId, isVerified, isActive, addresses[], wishlist[], notificationPrefs
```

### Farm
```
owner (→User), name, slug, description, farmType, images[], location{address,city,state,pincode,coordinates},
isVerified, isNaturallyGrown, isOrganic, certifications[], rating, totalReviews, totalSales,
bankDetails, commissionRate
```

### Product
```
farm (→Farm), seller (→User), name, slug, category, images[], price, unit, quantity,
harvestDate, expiryDate, isFreshToday, isNaturallyGrown, isOrganic, isPesticide,
rating, totalReviews, discount, isActive, isVerified
```

### Order
```
orderId, customer (→User), items[{product,farm,seller,name,price,quantity,subtotal}],
deliveryAddress, status (pending→confirmed→quality_check→picked_up→in_transit→delivered),
statusHistory[], payment{method,status,razorpayOrderId}, pricing{subtotal,deliveryCharge,total},
deliveryPartner, deliveryOTP, estimatedDelivery
```

### Review
```
customer, product, farm, order, rating(1-5), title, comment, images[], 
isVerifiedPurchase, helpfulVotes, reply{text,repliedAt}
```

---

## 🔌 API Routes

### Auth
```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me                      [protected]
PUT    /api/auth/profile                 [protected]
POST   /api/auth/wishlist/:productId     [protected]
```

### Farms
```
GET    /api/farms                        [public]
GET    /api/farms/mine                   [farmer]
POST   /api/farms                        [farmer]
PUT    /api/farms/mine                   [farmer]
GET    /api/farms/:slug                  [public]
PUT    /api/farms/:id/verify             [admin]
```

### Products
```
GET    /api/products                     [public] ?search,category,isOrganic,isFreshToday,minPrice,maxPrice,sort,page,limit
GET    /api/products/farmer/mine         [farmer]
GET    /api/products/:id                 [public]  (includes alternatives from other farms)
POST   /api/products                     [farmer]
PUT    /api/products/:id                 [farmer]
DELETE /api/products/:id                 [farmer]
```

### Orders
```
POST   /api/orders                       [customer]
GET    /api/orders/mine                  [customer]
GET    /api/orders/farmer/mine           [farmer]
GET    /api/orders                       [admin|delivery]
GET    /api/orders/:id                   [owner|admin|delivery]
PUT    /api/orders/:id/status            [admin|delivery]
```

---

## 🎭 User Roles & Dashboards

| Role     | Dashboard URL  | Capabilities |
|----------|---------------|--------------|
| Customer | /dashboard    | Browse, cart, orders, wishlist |
| Farmer   | /farmer       | Farm profile, products, orders, earnings |
| Admin    | /admin        | All orders, verify farms, manage users |
| Delivery | /delivery     | Active pickups, mark status, route info |

---

## 🧩 Key Features Implemented

- ✅ JWT Authentication with role-based access
- ✅ Farm profile pages with produce listings
- ✅ Product search, filter by category/organic/freshness/price
- ✅ "Same product from other farms" comparison on product detail
- ✅ Cart with localStorage persistence
- ✅ Multi-step checkout (address → payment)
- ✅ Order tracking with status history
- ✅ Farmer product CRUD (add/edit/delete)
- ✅ Farmer order management
- ✅ Admin order status control
- ✅ Delivery partner workflow
- ✅ Framer Motion animations throughout
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ react-hot-toast notifications

---

## ☁️ Deployment

### Backend — Railway / Render

1. Push to GitHub
2. Create new service on [Railway](https://railway.app) or [Render](https://render.com)
3. Set environment variables from `.env.example`
4. Set start command: `node server.js`

### Frontend — Vercel

1. Import the `frontend/` folder on [Vercel](https://vercel.com)
2. Set environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
3. Update `frontend/vite.config.js` proxy target or use the env var in `api.js`

### MongoDB Atlas
1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string and set `MONGO_URI` in backend `.env`

### Cloudinary (Image Uploads)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, API Secret
3. Add to backend `.env`

---

## 🔮 Next Steps / Roadmap

- [ ] Google OAuth login
- [ ] Razorpay payment integration
- [ ] Google Maps for farm distance
- [ ] Real-time order tracking with Socket.io
- [ ] Push notifications
- [ ] AI product recommendations
- [ ] Seller earnings & payout dashboard
- [ ] Review & rating system
- [ ] Admin analytics charts
- [ ] Mobile app (React Native)
