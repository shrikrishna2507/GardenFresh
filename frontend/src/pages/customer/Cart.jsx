import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiTrash2, FiArrowLeft, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Cart() {
  const { cart, removeFromCart, updateQty, totalPrice, totalItems } = useCart()
  const { user }    = useAuth()
  const navigate    = useNavigate()

  if (cart.length === 0) {
    return (
      <div className="page-container py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some fresh produce to get started!</p>
        <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2"><FiShoppingBag /> Browse Products</Link>
      </div>
    )
  }

  const deliveryCharge = totalPrice >= 300 ? 0 : 30

  return (
    <div className="page-container py-8">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/marketplace" className="text-gray-400 hover:text-gray-700 transition-colors"><FiArrowLeft className="text-xl" /></Link>
        <h1 className="text-2xl font-black text-gray-900">Shopping Cart <span className="text-green-600">({totalItems} items)</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {cart.map(item => (
              <motion.div key={item._id} layout initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="card p-4 flex gap-4 items-center">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-green-50 shrink-0">
                  {item.images?.[0]?.url
                    ? <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">🥦</div>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  <p className="text-xs text-green-600 font-medium">{item.farm?.name}</p>
                  <p className="text-xs text-gray-400">{item.unit}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1.5">
                      <button onClick={() => updateQty(item._id, item.cartQty - 1)} className="font-bold text-gray-600 hover:text-gray-900 text-lg leading-none">−</button>
                      <span className="font-bold text-sm w-5 text-center">{item.cartQty}</span>
                      <button onClick={() => updateQty(item._id, item.cartQty + 1)} className="font-bold text-gray-600 hover:text-gray-900 text-lg leading-none">+</button>
                    </div>
                    <span className="font-bold text-green-700">₹{(item.price * item.cartQty).toFixed(0)}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item._id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <FiTrash2 />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="font-bold text-gray-900 text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {cart.map(item => (
                <div key={item._id} className="flex justify-between text-sm text-gray-600">
                  <span className="truncate mr-2">{item.name} × {item.cartQty}</span>
                  <span className="font-medium shrink-0">₹{(item.price * item.cartQty).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-200 pt-4 space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery</span>
                <span className={`font-medium ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                  {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
                </span>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-green-600">Add ₹{(300 - totalPrice).toFixed(0)} more for free delivery</p>
              )}
            </div>
            <div className="flex justify-between font-black text-lg mb-6">
              <span>Total</span>
              <span className="text-green-700">₹{(totalPrice + deliveryCharge).toFixed(0)}</span>
            </div>
            <button onClick={() => user ? navigate('/checkout') : navigate('/login')}
              className="w-full btn-orange py-3.5 text-base font-bold">
              {user ? 'Proceed to Checkout →' : 'Login to Checkout'}
            </button>
            <Link to="/marketplace" className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-3 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
