import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiPackage, FiMapPin, FiPhone, FiCheck, FiTruck } from 'react-icons/fi'
import { orderAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'
import toast from 'react-hot-toast'

const STATUS_FLOW = {
  confirmed:     'quality_check',
  quality_check: 'picked_up',
  picked_up:     'in_transit',
  in_transit:    'delivered',
}

const STATUS_COLOR = {
  confirmed:     'bg-blue-100 text-blue-700',
  quality_check: 'bg-orange-100 text-orange-700',
  picked_up:     'bg-indigo-100 text-indigo-700',
  in_transit:    'bg-purple-100 text-purple-700',
  delivered:     'bg-green-100 text-green-700',
  pending:       'bg-yellow-100 text-yellow-700',
}

export default function DeliveryDashboard() {
  const [orders,  setOrders]  = useState([])
  const [loading, setLoading] = useState(true)
  const [tab,     setTab]     = useState('active')

  async function load() {
    setLoading(true)
    try {
      const res = await orderAPI.getAll({ limit: 50 })
      setOrders(res.data.orders || [])
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function advance(order) {
    const next = STATUS_FLOW[order.status]
    if (!next) return
    try {
      await orderAPI.updateStatus(order._id, { status: next, note: `Marked as ${next} by delivery partner` })
      toast.success(`Order marked as ${next.replace('_', ' ')}`)
      load()
    } catch { toast.error('Failed to update') }
  }

  const activeOrders    = orders.filter(o => !['delivered', 'cancelled', 'pending'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')
  const displayed       = tab === 'active' ? activeOrders : completedOrders

  return (
    <div className="page-container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Delivery Dashboard</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your pickups and deliveries</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active',    value: activeOrders.length,    icon: <FiTruck />,   color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Delivered', value: completedOrders.length, icon: <FiCheck />,   color: 'text-green-600',  bg: 'bg-green-50' },
          { label: 'Total',     value: orders.length,          icon: <FiPackage />, color: 'text-gray-600',   bg: 'bg-gray-50' },
        ].map(s => (
          <div key={s.label} className={`card p-4 ${s.bg}`}>
            <div className={`text-xl mb-1 ${s.color}`}>{s.icon}</div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[['active', '🚚 Active'], ['completed', '✅ Completed']].map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}>
            {l}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : displayed.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">{tab === 'active' ? '🚚' : '✅'}</p>
          <p className="text-gray-500">{tab === 'active' ? 'No active deliveries' : 'No completed deliveries yet'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayed.map(order => (
            <motion.div key={order._id} layout className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-bold text-green-700">#{order.orderId}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${STATUS_COLOR[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status?.replace('_', ' ')}
                </span>
              </div>

              {/* Customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-400 mb-1">CUSTOMER</p>
                  <p className="font-semibold text-gray-900 text-sm">{order.customer?.name}</p>
                  <a href={`tel:${order.customer?.phone}`}
                    className="flex items-center gap-1.5 text-green-600 text-sm mt-1 hover:underline">
                    <FiPhone className="text-xs" /> {order.customer?.phone}
                  </a>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs font-semibold text-gray-400 mb-1">DELIVER TO</p>
                  <div className="flex items-start gap-1.5">
                    <FiMapPin className="text-green-500 shrink-0 mt-0.5 text-xs" />
                    <p className="text-sm text-gray-700 leading-snug">
                      {order.deliveryAddress?.line1}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-400 mb-2">ITEMS</p>
                <div className="flex flex-wrap gap-2">
                  {order.items?.map((item, i) => (
                    <span key={i} className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                      {item.name} × {item.quantity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-black text-green-700">₹{order.pricing?.total}</span>
                {STATUS_FLOW[order.status] && (
                  <button onClick={() => advance(order)}
                    className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
                    <FiCheck />
                    Mark as {STATUS_FLOW[order.status]?.replace('_', ' ')}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
