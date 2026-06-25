import { useEffect, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { FiUsers, FiShoppingBag, FiPackage, FiTrendingUp, FiHome, FiMenu, FiX } from 'react-icons/fi'
import { MdOutlineLocalFlorist } from 'react-icons/md'
import { orderAPI, productAPI, farmAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

function AdminOverview() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([
      orderAPI.getAll({ limit: 100 }),
      productAPI.getAll({ limit: 1 }),
      farmAPI.getAll({ limit: 1 }),
    ]).then(([or, pr, fr]) => {
      const orders  = or.data
      const revenue = 0 // would calculate from orders
      setStats({ orders: orders.total, products: pr.data.total, farms: fr.data.total, revenue })
    })
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-6">Overview</h2>
      {!stats ? <Spinner /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: <FiPackage />, label: 'Total Orders',    value: stats.orders,   color: 'text-blue-600',   bg: 'bg-blue-50' },
            { icon: <FiShoppingBag />, label: 'Products',   value: stats.products, color: 'text-green-600',  bg: 'bg-green-50' },
            { icon: <FiHome />,     label: 'Farms',          value: stats.farms,    color: 'text-orange-600', bg: 'bg-orange-50' },
            { icon: <FiTrendingUp />, label: 'Revenue',      value: '—',            color: 'text-emerald-600', bg: 'bg-emerald-50' },
          ].map(s => (
            <div key={s.label} className={`card p-5 ${s.bg}`}>
              <div className={`text-2xl mb-2 ${s.color}`}>{s.icon}</div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link to="/admin/orders" className="p-4 bg-blue-50 rounded-xl text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-colors">📦 Manage Orders</Link>
          <Link to="/admin/farms"  className="p-4 bg-green-50 rounded-xl text-sm font-semibold text-green-700 hover:bg-green-100 transition-colors">🌾 Verify Farms</Link>
          <Link to="/admin/users"  className="p-4 bg-orange-50 rounded-xl text-sm font-semibold text-orange-700 hover:bg-orange-100 transition-colors">👥 Manage Users</Link>
        </div>
      </div>
    </div>
  )
}

function AdminOrders() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getAll({ limit: 50 }).then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }, [])

  async function updateStatus(id, status) {
    await orderAPI.updateStatus(id, { status, note: `Status updated to ${status} by admin` })
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o))
  }

  if (loading) return <Spinner />

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-6">All Orders</h2>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left text-gray-500">
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Update Status', 'Date'].map(h => (
                  <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map(o => (
                <tr key={o._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-green-700 text-xs">#{o.orderId}</td>
                  <td className="px-4 py-3 text-gray-700">{o.customer?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{o.items?.length}</td>
                  <td className="px-4 py-3 font-bold">₹{o.pricing?.total}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 capitalize">{o.status?.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3">
                    <select defaultValue={o.status} onChange={e => updateStatus(o._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:border-green-400">
                      {['pending', 'confirmed', 'quality_check', 'picked_up', 'in_transit', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const NAV = [
  { to: '/admin',        label: 'Overview', icon: <FiTrendingUp /> },
  { to: '/admin/orders', label: 'Orders',   icon: <FiPackage /> },
  { to: '/admin/farms',  label: 'Farms',    icon: <FiHome /> },
  { to: '/admin/users',  label: 'Users',    icon: <FiUsers /> },
]

export default function AdminDashboard() {
  const location = useLocation()
  const [sideOpen, setSideOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-60 bg-green-900 text-white flex flex-col transition-transform duration-200 ${sideOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:relative md:flex`}>
        <div className="flex items-center gap-2 px-6 py-5 border-b border-green-800">
          <MdOutlineLocalFlorist className="text-green-300 text-xl" />
          <span className="font-bold">GardenFresh Admin</span>
          <button onClick={() => setSideOpen(false)} className="ml-auto md:hidden"><FiX /></button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(n => (
            <Link key={n.to} to={n.to} onClick={() => setSideOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${location.pathname === n.to ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-800'}`}>
              {n.icon} {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-green-800">
          <Link to="/" className="text-xs text-green-400 hover:text-green-200">← Back to site</Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-3 md:hidden">
          <button onClick={() => setSideOpen(true)}><FiMenu className="text-xl" /></button>
          <span className="font-bold text-gray-900">Admin Panel</span>
        </header>
        <main className="flex-1 p-6">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="farms"  element={<div className="text-center py-20 text-gray-400">Farm verification coming soon</div>} />
            <Route path="users"  element={<div className="text-center py-20 text-gray-400">User management coming soon</div>} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
