import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPackage, FiHeart, FiUser, FiClock } from 'react-icons/fi'
import { orderAPI } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../../components/common/Spinner'

const STATUS_COLOR = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', in_transit: 'bg-purple-100 text-purple-700', quality_check: 'bg-orange-100 text-orange-700', picked_up: 'bg-indigo-100 text-indigo-700' }

export default function CustomerDashboard() {
  const { user }        = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getMine().then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }, [])

  const activeOrders    = orders.filter(o => !['delivered', 'cancelled'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')

  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FiPackage className="text-green-600 text-xl" />, label: 'Total Orders',    value: orders.length,          bg: 'bg-green-50' },
          { icon: <FiClock className="text-blue-600 text-xl" />,    label: 'Active Orders',   value: activeOrders.length,    bg: 'bg-blue-50' },
          { icon: <FiPackage className="text-emerald-600 text-xl" />, label: 'Delivered',    value: completedOrders.length,  bg: 'bg-emerald-50' },
          { icon: <FiHeart className="text-red-500 text-xl" />,     label: 'Wishlist Items',  value: user?.wishlist?.length || 0, bg: 'bg-red-50' },
        ].map(s => (
          <div key={s.label} className={`card p-5 flex items-center gap-4 ${s.bg}`}>
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">{s.icon}</div>
            <div>
              <p className="text-2xl font-black text-gray-900">{s.value}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Profile */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-2xl font-black text-green-700">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 text-sm">{user?.email}</p>
            {user?.phone && <p className="text-gray-500 text-sm">{user?.phone}</p>}
          </div>
          <button className="ml-auto btn-secondary text-sm flex items-center gap-2 py-2 px-4">
            <FiUser /> Edit Profile
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-900 text-lg">My Orders</h2>
          <span className="text-sm text-gray-500">{orders.length} orders</span>
        </div>

        {loading ? <Spinner /> : orders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🛒</p>
            <p className="text-gray-500 mb-4">No orders yet</p>
            <Link to="/marketplace" className="btn-primary text-sm">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map(order => (
              <Link key={order._id} to={`/order-success/${order._id}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-200 hover:bg-green-50 transition-all">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-xl">📦</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">Order #{order.orderId}</p>
                  <p className="text-xs text-gray-500">{order.items.length} items · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <p className="text-sm font-bold text-green-700 mt-1">₹{order.pricing?.total}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
