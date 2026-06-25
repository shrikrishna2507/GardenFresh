import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiHeart, FiShoppingCart, FiMapPin } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { authAPI } from '../../services/api'
import StarRating from '../common/StarRating'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const { addToCart, cart } = useCart()
  const { user }            = useAuth()
  const inCart = cart.find(i => i._id === product._id)

  async function handleWishlist(e) {
    e.preventDefault()
    if (!user) return toast.error('Please login to save wishlist')
    await authAPI.toggleWishlist(product._id)
    toast.success('Wishlist updated')
  }

  const image = product.images?.[0]?.url

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/product/${product._id}`} className="card block overflow-hidden group">
        {/* Image */}
        <div className="relative aspect-square bg-green-50 overflow-hidden">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              {product.category === 'fruits' ? '🍎' : product.category === 'herbs' ? '🌿' : '🥦'}
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isFreshToday    && <span className="badge-fresh">🌱 Fresh Today</span>}
            {product.isOrganic       && <span className="badge-organic">✓ Organic</span>}
            {product.discount > 0    && <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{product.discount}% OFF</span>}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform opacity-0 group-hover:opacity-100">
            <FiHeart className="text-gray-400 hover:text-red-500 transition-colors text-sm" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-400 mb-0.5 capitalize">{product.category}</p>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{product.name}</h3>

          {/* Farm */}
          {product.farm && (
            <div className="flex items-center gap-1 mb-2">
              <FiMapPin className="text-green-500 text-xs shrink-0" />
              <span className="text-xs text-green-700 font-medium truncate">{product.farm.name}</span>
              {product.farm.isVerified && <MdVerified className="text-blue-500 text-xs shrink-0" />}
            </div>
          )}

          {/* Rating */}
          {product.rating > 0 && (
            <div className="mb-2">
              <StarRating rating={product.rating} count={product.totalReviews} />
            </div>
          )}

          {/* Price + Cart */}
          <div className="flex items-center justify-between mt-2">
            <div>
              <span className="font-bold text-green-700 text-base">₹{product.price}</span>
              <span className="text-gray-400 text-xs ml-1">/{product.unit}</span>
            </div>
            <button
              onClick={e => { e.preventDefault(); addToCart(product) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                inCart
                  ? 'bg-orange-500 text-white hover:bg-orange-600'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <FiShoppingCart className="text-xs" />
              {inCart ? `${inCart.cartQty} Added` : 'Add'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
