import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiShoppingBag, FiTrendingUp, FiPlus, FiStar } from 'react-icons/fi'
import { productAPI, orderAPI, farmAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/common/Spinner'

export default function FarmerDashboard() {
  const { user }   = useAuth()
  const [stats, setStats]   = useState({ products: 0, orders: 0, revenue: 0, rating: 0 })
  const [orders, setOrders] = useState([])
  const [farm, setFarm]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      productAPI.getMine(),
      orderAPI.getFarmerOrders(),
      farmAPI.getMine().catch(() => ({ data: { farm: null } })),
    ]).then(([pr, or, fr]) => {
      const products = pr.data.products
      const orders   = or.data.orders
      const revenue  = orders.filter(o => o.status === 'delivered')
        .reduce((s, o) => s + (o.pricing?.total || 0), 0)
      setStats({ products: products.length, orders: orders.length, revenue, rating: fr.data.farm?.rating || 0 })
      setOrders(orders.slice(0, 8))
      setFarm(fr.data.farm)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner fullPage />

  return (
    <div className="page-container py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Farmer Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name?.split(' ')[0]}!</p>
        </div>
        <div className="flex gap-3">
          <Link to="/farmer/products" className="btn-secondary text-sm flex items-center gap-2"><FiShoppingBag /> My Products</Link>
          <Link to="/farmer/products" className="btn-primary text-sm flex items-center gap-2"><FiPlus /> Add Product</Link>
        </div>
      </div>

      {/* Farm setup alert */}
      {!farm && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-orange-800">Complete your farm profile</p>
            <p className="text-sm text-orange-600">Set up your farm profile to start selling</p>
          </div>
          <Link to="/farmer/setup" className="btn-orange text-sm py-2">Setup Farm Profile →</Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FiShoppingBag />, label: 'Products Listed', value: stats.products, color: 'text-green-600', bg: 'bg-green-50' },
          { icon: <FiPackage />,     label: 'Total Orders',    value: stats.orders,   color: 'text-blue-600',  bg: 'bg-blue-50' },
          { icon: <FiTrendingUp />,  label: 'Revenue Earned',  value: `₹${stats.revenue}`, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { icon: <FiStar />,        label: 'Farm Rating',     value: stats.rating ? stats.rating.toFixed(1) : '—', color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`card p-5 ${s.bg}`}>
            <div className={`text-2xl mb-2 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Farm profile card */}
      {farm && (
        <div className="card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900">My Farm</h2>
            <Link to="/farmer/setup" className="text-sm text-green-600 hover:underline">Edit</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🌾</div>
            <div>
              <p className="font-bold text-gray-900">{farm.name}</p>
              <p className="text-sm text-gray-500">{farm.location?.city}, {farm.location?.state}</p>
              <div className="flex gap-2 mt-1">
                {farm.isVerified && <span className="badge-verified text-xs">✓ Verified</span>}
                {farm.isOrganic  && <span className="badge-organic text-xs">Organic</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 text-lg">Recent Orders</h2>
          <Link to="/farmer/orders" className="text-sm text-green-600 hover:underline">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-3xl mb-3">📦</p>
            <p className="text-gray-500 text-sm">No orders yet. Add products to start receiving orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-gray-100">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 font-medium text-green-700">#{order.orderId}</td>
                    <td className="py-3 text-gray-700">{order.customer?.name}</td>
                    <td className="py-3 text-gray-500">{order.items?.length} items</td>
                    <td className="py-3 font-semibold">₹{order.pricing?.total}</td>
                    <td className="py-3">
                      <span className="capitalize text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                        {order.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
