import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight } from 'react-icons/fi'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function AboutUs() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-900 to-green-700 text-white py-20">
        <div className="page-container text-center">
          <motion.div variants={fadeUp} initial="hidden" animate="show">
            <h1 className="text-4xl md:text-5xl font-black mb-4">About GardenFresh</h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
              We're on a mission to connect home growers with nearby customers — making fresh, naturally grown produce accessible to everyone while creating income for small-scale farmers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="page-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Millions of families grow vegetables and fruits in their home gardens, terraces, and small plots. But because they grow in small quantities, they can't access wholesale markets — so their fresh, chemical-free produce goes to waste.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                GardenFresh solves this by giving every home grower a digital storefront to sell directly to nearby customers — no middlemen, no waste, just fresh food and fair income.
              </p>
              <p className="text-gray-600 leading-relaxed">
                For customers, it means knowing exactly where their food comes from — which garden, which grower, harvested when — so they can make informed choices about what they eat.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { emoji: '🌱', title: 'Support Local Growers', desc: 'Create market access for home gardeners and small farmers' },
                { emoji: '🥗', title: 'Fresh & Natural', desc: 'Deliver chemical-free, naturally grown produce' },
                { emoji: '🚫', title: 'No Middlemen', desc: 'Direct farm-to-home connection' },
                { emoji: '🌍', title: 'Sustainable', desc: 'Promote local agriculture and reduce food miles' },
              ].map(v => (
                <div key={v.title} className="card p-5 bg-green-50">
                  <div className="text-3xl mb-3">{v.emoji}</div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{v.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-green-800 text-white">
        <div className="page-container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[['500+', 'Home Growers'], ['10,000+', 'Happy Customers'], ['50+', 'Localities Served'], ['2 hrs', 'Avg. Delivery Time']].map(([v, l]) => (
              <div key={l}>
                <p className="text-4xl font-black text-green-300 mb-1">{v}</p>
                <p className="text-green-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="page-container text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Our Values</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">Everything we do is guided by these principles</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { emoji: '💚', title: 'Transparency', desc: 'Every product shows who grew it, when it was harvested, and how it was grown. No hidden supply chains.' },
              { emoji: '🤝', title: 'Community', desc: 'We build bridges between neighbours — the person who grows your tomatoes might live 2 streets away.' },
              { emoji: '🌿', title: 'Sustainability', desc: 'Local produce means less transportation, fresher food, and a smaller carbon footprint for everyone.' },
            ].map(v => (
              <motion.div key={v.title} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
                className="card p-8">
                <div className="text-4xl mb-4">{v.emoji}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-50">
        <div className="page-container text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-3">Ready to join the movement?</h2>
          <p className="text-gray-500 mb-6">Whether you grow or just love fresh food — there's a place for you on GardenFresh</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/marketplace" className="btn-primary inline-flex items-center gap-2">Shop Fresh <FiArrowRight /></Link>
            <Link to="/register"    className="btn-secondary inline-flex items-center gap-2">Start Selling <FiArrowRight /></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
