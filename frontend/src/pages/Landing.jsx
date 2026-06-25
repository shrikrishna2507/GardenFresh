import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowRight, FiStar, FiShield, FiMapPin, FiClock } from 'react-icons/fi'
import { MdVerified } from 'react-icons/md'
import { productAPI, farmAPI } from '../services/api'
import ProductCard from '../components/marketplace/ProductCard'
import FarmCard from '../components/farm/FarmCard'
import Spinner from '../components/common/Spinner'

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } }

export default function Landing() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [farms, setFarms]                       = useState([])
  const [loading, setLoading]                   = useState(true)

  useEffect(() => {
    Promise.all([
      productAPI.getAll({ isFreshToday: true, limit: 8 }),
      farmAPI.getAll({ limit: 4 }),
    ]).then(([pr, fr]) => {
      setFeaturedProducts(pr.data.products || [])
      setFarms(fr.data.farms || [])
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-900 via-green-800 to-green-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="absolute text-4xl" style={{
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}>
              {['🌿', '🍅', '🥦', '🌱', '🥕', '🍃'][i % 6]}
            </div>
          ))}
        </div>
        <div className="page-container relative py-24 md:py-32">
          <motion.div variants={fadeUp} initial="hidden" animate="show" transition={{ duration: 0.6 }}
            className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              🌿 Hyperlocal Farm-to-Home Marketplace
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Fresh from your <span className="text-green-300">neighbour's garden</span> to your table
            </h1>
            <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl leading-relaxed">
              Buy vegetables, fruits and herbs directly from local home growers and farmers. No middlemen. No chemicals. Just fresh, naturally grown produce.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/marketplace" className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-all hover:shadow-xl hover:-translate-y-0.5">
                Shop Fresh Produce <FiArrowRight />
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-all">
                Sell Your Produce
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 mt-10 text-sm text-green-200">
              {[['500+', 'Home Growers'], ['10K+', 'Happy Customers'], ['50+', 'Farm Varieties'], ['2hr', 'Delivery']].map(([v, l]) => (
                <div key={l}><span className="font-bold text-white text-xl">{v}</span><br />{l}</div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title mb-3">How GardenFresh Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From garden to your doorstep in a few simple steps</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: '🌱', step: '01', title: 'Growers Register', desc: 'Home gardeners & farmers create their farm profile' },
              { icon: '🛒', step: '02', title: 'You Shop & Choose', desc: 'Browse produce, compare farms, pick your preferred grower' },
              { icon: '✅', step: '03', title: 'Quality Verified', desc: 'GardenFresh verifies freshness before pickup' },
              { icon: '🚚', step: '04', title: 'Fresh Delivery', desc: 'Delivered to your door within 2 hours' },
            ].map((s, i) => (
              <motion.div key={s.step} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">{s.icon}</div>
                <div className="text-xs font-bold text-green-500 mb-1">STEP {s.step}</div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fresh Today ───────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">🌱 Fresh Today</h2>
              <p className="text-gray-500 mt-1">Harvested this morning, delivered today</p>
            </div>
            <Link to="/marketplace?isFreshToday=true" className="btn-secondary text-sm hidden md:flex items-center gap-2">
              View All <FiArrowRight />
            </Link>
          </div>
          {loading ? <Spinner /> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <Link to="/marketplace?isFreshToday=true" className="btn-secondary text-sm flex items-center gap-2 w-fit mx-auto mt-6 md:hidden">
            View All <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center mb-12">
            <h2 className="section-title mb-3">Why GardenFresh?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <MdVerified className="text-blue-500 text-3xl" />, title: 'Verified Growers', desc: 'Every farm is verified by our team. Know exactly who grows your food.' },
              { icon: <FiShield className="text-green-500 text-3xl" />, title: 'Quality Guarantee', desc: 'Every order goes through our quality check before delivery.' },
              { icon: <FiMapPin className="text-orange-500 text-3xl" />, title: 'Hyperlocal', desc: 'Buy from farms within your city. Ultra-fresh, minimal travel time.' },
              { icon: <FiClock className="text-purple-500 text-3xl" />, title: '2-Hour Delivery', desc: 'Morning order, afternoon delivery. That\'s how fresh we keep it.' },
              { icon: <FiStar className="text-amber-500 text-3xl" />, title: 'Farm Ratings', desc: 'Real reviews from real customers. Choose your farm confidently.' },
              { icon: <span className="text-3xl">🌿</span>, title: 'No Pesticides', desc: 'Naturally grown produce from home gardens and small farms.' },
            ].map((f, i) => (
              <motion.div key={f.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-6 rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-card transition-all">
                <div className="shrink-0 mt-1">{f.icon}</div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Farms ────────────────────────────── */}
      {farms.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="section-title">🏡 Local Farms Near You</h2>
                <p className="text-gray-500 mt-1">Verified home growers in your area</p>
              </div>
              <Link to="/marketplace?tab=farms" className="btn-secondary text-sm hidden md:flex items-center gap-2">
                All Farms <FiArrowRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {farms.map(f => <FarmCard key={f._id} farm={f} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ──────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="page-container text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Have a garden? Start selling today!</h2>
            <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
              Turn your home garden into income. Register as a grower and reach hundreds of customers nearby.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-green-800 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-all hover:shadow-xl hover:-translate-y-0.5">
              Start Selling Free <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
