import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiHeart, FiMapPin, FiCalendar, FiArrowLeft } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { productAPI } from '../../services/api'
import { useCart } from '../../context/CartContext'
import Spinner from '../../components/common/Spinner'
import StarRating from '../../components/common/StarRating'
import ProductCard from '../../components/marketplace/ProductCard'

export default function ProductDetail() {
  const { id }           = useParams()
  const { addToCart }    = useCart()
  const [data, setData]  = useState(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty]    = useState(1)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    setLoading(true)
    productAPI.getOne(id).then(res => setData(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner fullPage />
  if (!data)   return <div className="page-container py-20 text-center text-gray-500">Product not found</div>

  const { product, alternatives } = data
  const farm = product.farm

  return (
    <div className="page-container py-8">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <FiArrowLeft /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-green-50 mb-3">
            {product.images?.[activeImg]?.url ? (
              <img src={product.images[activeImg].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                {product.category === 'fruits' ? '🍎' : product.category === 'herbs' ? '🌿' : '🥦'}
              </div>
            )}
          </div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-green-500' : 'border-transparent'}`}>
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {product.isFreshToday    && <span className="badge-fresh">🌱 Fresh Today</span>}
            {product.isOrganic       && <span className="badge-organic">✅ Organic</span>}
            {product.isNaturallyGrown && <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">🌿 Naturally Grown</span>}
            {!product.isPesticide    && <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-0.5 rounded-full">Pesticide Free</span>}
          </div>

          <h1 className="text-3xl font-black text-gray-900 mb-2">{product.name}</h1>
          <p className="text-gray-500 capitalize mb-4">{product.category}</p>

          {product.rating > 0 && (
            <div className="mb-4">
              <StarRating rating={product.rating} count={product.totalReviews} size="md" />
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-black text-green-700">₹{product.price}</span>
            <span className="text-gray-400 text-lg">/{product.unit}</span>
            {product.discount > 0 && (
              <span className="text-sm font-bold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-lg">{product.discount}% OFF</span>
            )}
          </div>

          {/* Farm info */}
          {farm && (
            <Link to={`/farm/${farm.slug}`}
              className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100 hover:border-green-300 transition-colors mb-6">
              <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center text-xl shrink-0">🌾</div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-900">{farm.name}</span>
                  {farm.isVerified && <MdVerified className="text-blue-500" />}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FiMapPin className="text-green-500" />
                  {farm.location?.city}, {farm.location?.state}
                </div>
              </div>
              <StarRating rating={farm.rating} size="sm" />
            </Link>
          )}

          {/* Harvest date */}
          {product.harvestDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <FiCalendar className="text-green-500" />
              Harvested: {new Date(product.harvestDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}

          {/* Stock */}
          <div className="text-sm text-gray-500 mb-4">
            {product.quantity > 0
              ? <span className="text-green-600 font-medium">✓ In Stock ({product.quantity} {product.unit} available)</span>
              : <span className="text-red-500 font-medium">Out of Stock</span>}
          </div>

          {/* Qty + Cart */}
          {product.quantity > 0 && (
            <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2.5">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="text-xl font-bold text-gray-600 hover:text-gray-900 w-6 text-center">−</button>
                <span className="font-bold text-gray-900 w-6 text-center">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.quantity, q + 1))} className="text-xl font-bold text-gray-600 hover:text-gray-900 w-6 text-center">+</button>
              </div>
              <button onClick={() => addToCart(product, qty)} className="flex-1 btn-primary flex items-center justify-center gap-2">
                <FiShoppingCart /> Add to Cart
              </button>
              <button className="w-12 h-12 flex items-center justify-center border border-gray-200 rounded-xl hover:border-red-300 hover:bg-red-50 transition-colors">
                <FiHeart className="text-gray-400 hover:text-red-500 transition-colors" />
              </button>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div className="mt-2 p-4 bg-gray-50 rounded-xl">
              <h3 className="font-semibold text-gray-800 mb-2">About this product</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Same product from other farms */}
      {alternatives?.length > 0 && (
        <div className="mt-16">
          <h2 className="section-title mb-2">🏪 Same Product from Other Farms</h2>
          <p className="text-gray-500 text-sm mb-6">Compare price, freshness and ratings</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {alternatives.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
