import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMapPin } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import StarRating from '../common/StarRating'

const farmTypeLabel = {
  home_garden:      '🏡 Home Garden',
  terrace_garden:   '🌿 Terrace Garden',
  small_farm:       '🌾 Small Farm',
  community_garden: '👥 Community Garden',
}

export default function FarmCard({ farm }) {
  const cover = farm.images?.[0]?.url

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link to={`/farm/${farm.slug}`} className="card block overflow-hidden group">
        {/* Cover */}
        <div className="relative h-40 bg-green-50 overflow-hidden">
          {cover ? (
            <img src={cover} alt={farm.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-green-100 to-emerald-50">🌱</div>
          )}
          {farm.isVerified && (
            <div className="absolute top-2 left-2 badge-verified flex items-center gap-1">
              <MdVerified className="text-xs" /> Verified
            </div>
          )}
          {farm.isOrganic && (
            <div className="absolute top-2 right-2 badge-organic">Organic</div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-base leading-tight">{farm.name}</h3>
          </div>
          <p className="text-xs text-green-600 font-medium mb-2">{farmTypeLabel[farm.farmType] || farm.farmType}</p>

          {farm.location?.city && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
              <FiMapPin className="text-green-500 shrink-0" />
              <span>{farm.location.city}, {farm.location.state}</span>
            </div>
          )}

          <StarRating rating={farm.rating} count={farm.totalReviews} />

          {farm.isNaturallyGrown && (
            <div className="mt-2 text-xs text-emerald-600 font-medium">🌿 Naturally Grown</div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
