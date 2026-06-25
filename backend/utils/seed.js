import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Farm from '../models/Farm.js';
import Product from '../models/Product.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('Connected to MongoDB');

// Clear
await Promise.all([User.deleteMany(), Farm.deleteMany(), Product.deleteMany()]);

// Admin
const admin = await User.create({
  name: 'Admin', email: 'admin@gardenfresh.com', password: 'Admin@123', role: 'admin', isVerified: true,
});

// Farmers
const farmer1 = await User.create({
  name: 'Krishna Shetty', email: 'krishna@gardenfresh.com', password: 'Farmer@123', role: 'farmer', isVerified: true,
});
const farmer2 = await User.create({
  name: 'Sumansa Rao', email: 'sumansa@gardenfresh.com', password: 'Farmer@123', role: 'farmer', isVerified: true,
});

// Customer
await User.create({
  name: 'Rahul Kumar', email: 'rahul@gardenfresh.com', password: 'Customer@123', role: 'customer', isVerified: true,
});

// Farms
const farm1 = await Farm.create({
  owner: farmer1._id,
  name: "Krishna's Garden",
  description: "Home terrace garden with organic vegetables grown without pesticides.",
  farmType: 'terrace_garden',
  isVerified: true,
  isNaturallyGrown: true,
  isOrganic: true,
  location: { address: 'Udupi', city: 'Udupi', state: 'Karnataka', pincode: '576101',
    coordinates: { type: 'Point', coordinates: [74.7421, 13.3409] } },
  rating: 4.8,
  totalReviews: 24,
});

const farm2 = await Farm.create({
  owner: farmer2._id,
  name: "Sumansa Farm",
  description: "Small-scale family farm supplying fresh seasonal produce.",
  farmType: 'small_farm',
  isVerified: true,
  isNaturallyGrown: true,
  isOrganic: false,
  location: { address: 'Manipal', city: 'Udupi', state: 'Karnataka', pincode: '576104',
    coordinates: { type: 'Point', coordinates: [74.7891, 13.3524] } },
  rating: 4.5,
  totalReviews: 18,
});

// Products
const productData = [
  { name: 'Tomatoes',   category: 'vegetables', price: 40, unit: '500g', quantity: 50, isFreshToday: true,  isOrganic: true,  farm: farm1._id, seller: farmer1._id },
  { name: 'Spinach',    category: 'greens',     price: 25, unit: 'bunch', quantity: 30, isFreshToday: true,  isOrganic: true,  farm: farm1._id, seller: farmer1._id },
  { name: 'Broccoli',   category: 'vegetables', price: 60, unit: '1 head', quantity: 20, isFreshToday: false, isOrganic: true,  farm: farm1._id, seller: farmer1._id },
  { name: 'Tomatoes',   category: 'vegetables', price: 35, unit: '500g', quantity: 80, isFreshToday: true,  isOrganic: false, farm: farm2._id, seller: farmer2._id },
  { name: 'Carrots',    category: 'vegetables', price: 30, unit: '500g', quantity: 60, isFreshToday: false, isOrganic: false, farm: farm2._id, seller: farmer2._id },
  { name: 'Mango',      category: 'fruits',     price: 80, unit: '4 pcs', quantity: 40, isFreshToday: true,  isOrganic: false, farm: farm2._id, seller: farmer2._id },
  { name: 'Coriander',  category: 'herbs',      price: 10, unit: 'bunch', quantity: 100, isFreshToday: true,  isOrganic: true,  farm: farm1._id, seller: farmer1._id },
  { name: 'Banana',     category: 'fruits',     price: 35, unit: '1 dozen', quantity: 50, isFreshToday: false, isOrganic: true,  farm: farm1._id, seller: farmer1._id },
];

for (const p of productData) {
  await Product.create({ ...p, isNaturallyGrown: true, isActive: true, isVerified: true });
}

console.log('✅ Seed complete!');
console.log('Admin:    admin@gardenfresh.com / Admin@123');
console.log('Farmer 1: krishna@gardenfresh.com / Farmer@123');
console.log('Farmer 2: sumansa@gardenfresh.com / Farmer@123');
console.log('Customer: rahul@gardenfresh.com / Customer@123');
process.exit(0);
