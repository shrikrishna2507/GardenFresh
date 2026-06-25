import { FiStar } from 'react-icons/fi'
import { MdStar, MdStarHalf } from 'react-icons/md'

export default function StarRating({ rating = 0, count, size = 'sm' }) {
  const textSize = size === 'sm' ? 'text-sm' : 'text-base'
  const iconSize = size === 'sm' ? 'text-base' : 'text-lg'
  const full  = Math.floor(rating)
  const half  = rating % 1 >= 0.5
  const empty = 5 - full - (half ? 1 : 0)

  return (
    <div className={`flex items-center gap-1 ${textSize}`}>
      <div className="flex items-center text-amber-400">
        {[...Array(full)].map((_, i)  => <MdStar key={`f${i}`} className={iconSize} />)}
        {half                          && <MdStarHalf className={iconSize} />}
        {[...Array(empty)].map((_, i) => <FiStar key={`e${i}`} className={`${iconSize} text-gray-300`} />)}
      </div>
      <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-gray-400">({count})</span>}
    </div>
  )
}
