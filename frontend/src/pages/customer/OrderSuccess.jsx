import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPackage, FiMapPin, FiClock } from 'react-icons/fi'
import { orderAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

const STATUS_STEPS = ['pending', 'confirmed', 'quality_check', 'picked_up', 'in_transit', 'delivered']
const STATUS_LABEL = { pending: 'Order Placed', confirmed: 'Confirmed', quality_check: 'Quality Check', picked_up: 'Picked Up', in_transit: 'On the Way', delivered: 'Delivered' }

export default function OrderSuccess() {
  const { id }          = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getOne(id).then(res => setOrder(res.data.order)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <Spinner fullPage />
  if (!order)  return <div className="page-container py-20 text-center">Order not found</div>

  const currentStep = STATUS_STEPS.indexOf(order.status)

  return (
    <div className="page-container py-12 max-w-2xl">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', duration: 0.6 }}
        className="text-center mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500">Order ID: <span className="font-bold text-gray-800">#{order.orderId}</span></p>
      </motion.div>

      {/* Tracking */}
      <div className="card p-6 mb-5">
        <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><FiPackage className="text-green-500" /> Order Tracking</h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />
          <div className="space-y-5">
            {STATUS_STEPS.map((s, i) => {
              const done  = i <= currentStep
              const active = i === currentStep
              return (
                <div key={s} className="flex items-start gap-4 pl-2">
                  <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${done ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'} ${active ? 'ring-4 ring-green-100' : ''}`}>
                    {done ? '✓' : i + 1}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${done ? 'text-gray-900' : 'text-gray-400'}`}>{STATUS_LABEL[s]}</p>
                    {active && <p className="text-xs text-green-600 font-medium mt-0.5">Current status</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card p-5 mb-5">
        <h2 className="font-bold text-gray-800 mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name} × {item.quantity} {item.unit}</span>
              <span className="font-semibold">₹{item.subtotal}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-gray-100 mt-4 pt-3 flex justify-between font-bold">
          <span>Total Paid</span>
          <span className="text-green-700">₹{order.pricing.total}</span>
        </div>
      </div>

      {/* Delivery info */}
      <div className="card p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><FiMapPin className="text-green-500" /> Delivery To</h2>
        <p className="text-sm text-gray-700 font-medium">{order.deliveryAddress.name}</p>
        <p className="text-sm text-gray-500">{order.deliveryAddress.line1}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
        <div className="flex items-center gap-2 mt-3 text-sm text-green-600">
          <FiClock /> Estimated delivery within 2 hours
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/marketplace" className="flex-1 btn-secondary text-center py-3">Continue Shopping</Link>
        <Link to="/dashboard" className="flex-1 btn-primary text-center py-3">My Orders</Link>
      </div>
    </div>
  )
}
