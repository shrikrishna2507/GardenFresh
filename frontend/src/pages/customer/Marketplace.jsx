import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFilter, FiX, FiSearch } from 'react-icons/fi'
import { productAPI } from '../../services/api'
import ProductCard from '../../components/marketplace/ProductCard'
import FarmCard from '../../components/farm/FarmCard'
import Spinner from '../../components/common/Spinner'
import { farmAPI } from '../../services/api'

const CATEGORIES = ['vegetables', 'fruits', 'herbs', 'nuts', 'greens', 'exotic', 'seasonal']

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab]         = useState(searchParams.get('tab') || 'products')
  const [products, setProducts] = useState([])
  const [farms, setFarms]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    search:          searchParams.get('search') || '',
    category:        '',
    isOrganic:       searchParams.get('isOrganic') || '',
    isFreshToday:    searchParams.get('isFreshToday') || '',
    isNaturallyGrown:'',
    minPrice:        '',
    maxPrice:        '',
    sort:            '-createdAt',
  })

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { ...filters, page, limit: 16 }
      Object.keys(params).forEach(k => !params[k] && delete params[k])
      const res = await productAPI.getAll(params)
      setProducts(res.data.products)
      setTotal(res.data.total)
    } finally { setLoading(false) }
  }, [filters, page])

  const fetchFarms = useCallback(async () => {
    setLoading(true)
    try {
      const res = await farmAPI.getAll({ limit: 20 })
      setFarms(res.data.farms)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { tab === 'products' ? fetchProducts() : fetchFarms() }, [tab, fetchProducts, fetchFarms])

  function updateFilter(key, val) {
    setFilters(p => ({ ...p, [key]: val }))
    setPage(1)
  }

  function clearFilters() {
    setFilters({ search: '', category: '', isOrganic: '', isFreshToday: '', isNaturallyGrown: '', minPrice: '', maxPrice: '', sort: '-createdAt' })
  }

  const activeFilterCount = [filters.category, filters.isOrganic, filters.isFreshToday, filters.isNaturallyGrown, filters.minPrice, filters.maxPrice].filter(Boolean).length

  return (
    <div className="page-container py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900">Fresh Marketplace</h1>
        <p className="text-gray-500 mt-1">Directly from local gardens & farms near you</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[['products', '🥦 Products'], ['farms', '🏡 Farms']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <>
          {/* Search + Filter bar */}
          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={filters.search} onChange={e => updateFilter('search', e.target.value)}
                placeholder="Search produce, farms..." className="input-field pl-10" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${showFilters ? 'bg-green-600 text-white border-green-600' : 'bg-white border-gray-200 text-gray-600 hover:border-green-300'}`}>
              <FiFilter /> Filters {activeFilterCount > 0 && <span className="bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
              className="input-field w-auto bg-white">
              <option value="-createdAt">Newest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="-rating">Top Rated</option>
            </select>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-card p-5 mb-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filters</h3>
                <button onClick={clearFilters} className="text-sm text-red-500 hover:underline flex items-center gap-1"><FiX /> Clear all</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => updateFilter('category', filters.category === c ? '' : c)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filters.category === c ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Toggles */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Type</label>
                  <div className="space-y-2">
                    {[['isFreshToday', '🌱 Fresh Today'], ['isOrganic', '✅ Organic'], ['isNaturallyGrown', '🌿 Naturally Grown']].map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!filters[key]} onChange={e => updateFilter(key, e.target.checked ? 'true' : '')}
                          className="accent-green-600 w-4 h-4" />
                        <span className="text-sm text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {/* Price range */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Price Range (₹)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)} className="input-field" />
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)} className="input-field" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Results */}
          <div className="mb-3 text-sm text-gray-500">{total} products found</div>
          {loading ? <Spinner /> : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-5xl mb-4">🌱</p>
              <h3 className="font-bold text-gray-800 text-lg mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
              {/* Pagination */}
              {total > 16 && (
                <div className="flex justify-center gap-2 mt-8">
                  {page > 1 && <button onClick={() => setPage(p => p - 1)} className="btn-secondary text-sm px-5">← Prev</button>}
                  <span className="px-4 py-2.5 text-sm text-gray-600">Page {page}</span>
                  {products.length === 16 && <button onClick={() => setPage(p => p + 1)} className="btn-secondary text-sm px-5">Next →</button>}
                </div>
              )}
            </>
          )}
        </>
      )}

      {tab === 'farms' && (
        loading ? <Spinner /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {farms.map(f => <FarmCard key={f._id} farm={f} />)}
          </div>
        )
      )}
    </div>
  )
}
