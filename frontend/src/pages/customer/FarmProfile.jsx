import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiMapPin, FiArrowLeft } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { farmAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'
import StarRating from '../../components/common/StarRating'
import ProductCard from '../../components/marketplace/ProductCard'

const farmTypeLabel = { home_garden: '🏡 Home Garden', terrace_garden: '🌿 Terrace Garden', small_farm: '🌾 Small Farm', community_garden: '👥 Community Garden' }

export default function FarmProfile() {
  const { slug }          = useParams()
  const [data, setData]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    farmAPI.getBySlug(slug).then(res => setData(res.data)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Spinner fullPage />
  if (!data)   return <div className="page-container py-20 text-center text-gray-500">Farm not found</div>

  const { farm, products } = data

  return (
    <div>
      {/* Cover */}
      <div className="relative h-56 md:h-72 bg-gradient-to-br from-green-700 to-green-500 overflow-hidden">
        {farm.images?.[0]?.url && (
          <img src={farm.images[0].url} alt={farm.name} className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 page-container pb-6">
          <Link to="/marketplace?tab=farms" className="inline-flex items-center gap-1.5 text-white/80 text-sm hover:text-white mb-3">
            <FiArrowLeft /> All Farms
          </Link>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="flex flex-col md:flex-row gap-8">

          {/* Sidebar */}
          <div className="md:w-72 shrink-0">
            <div className="card p-6 -mt-16 relative z-10">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl mb-4">🌾</div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-black text-gray-900">{farm.name}</h1>
                {farm.isVerified && <MdVerified className="text-blue-500 text-xl shrink-0" />}
              </div>
              <p className="text-sm text-green-600 font-medium mb-3">{farmTypeLabel[farm.farmType]}</p>
              <StarRating rating={farm.rating} count={farm.totalReviews} />

              <div className="mt-4 space-y-2.5">
                {farm.location?.city && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiMapPin className="text-green-500 shrink-0" />
                    {farm.location.address && <span>{farm.location.address}, </span>}
                    {farm.location.city}, {farm.location.state}
                  </div>
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {farm.isVerified       && <span className="badge-verified flex items-center gap-1"><MdVerified className="text-xs" /> Verified Farm</span>}
                {farm.isOrganic        && <span className="badge-organic">✅ Organic</span>}
                {farm.isNaturallyGrown && <span className="badge-fresh">🌿 Natural</span>}
              </div>

              {farm.description && (
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">{farm.description}</p>
              )}

              {farm.practicesSummary && (
                <div className="mt-4 p-3 bg-green-50 rounded-xl">
                  <p className="text-xs font-semibold text-green-700 mb-1">Growing Practices</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{farm.practicesSummary}</p>
                </div>
              )}

              <div className="mt-5 grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-green-700">{products?.length || 0}</p>
                  <p className="text-xs text-gray-500">Products</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xl font-black text-green-700">{farm.totalSales || 0}</p>
                  <p className="text-xs text-gray-500">Orders Fulfilled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-1">
            <h2 className="section-title mb-1">Products from {farm.name}</h2>
            <p className="text-gray-500 text-sm mb-6">{products?.length} fresh items available</p>

            {products?.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <p className="text-4xl mb-3">🌱</p>
                <p className="text-gray-500">No products listed yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
