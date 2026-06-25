import { useEffect, useState } from 'react'
import { orderAPI } from '../../services/api'
import Spinner from '../../components/common/Spinner'

const STATUS_COLOR = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-blue-100 text-blue-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700', in_transit: 'bg-purple-100 text-purple-700', quality_check: 'bg-orange-100 text-orange-700', picked_up: 'bg-indigo-100 text-indigo-700' }

export default function FarmerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderAPI.getFarmerOrders().then(res => setOrders(res.data.orders)).finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner fullPage />

  return (
    <div className="page-container py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20"><p className="text-5xl mb-4">📦</p><p className="text-gray-500">No orders yet</p></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-left text-gray-500">
                  {['Order ID', 'Customer', 'Items', 'Address', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-green-700">#{o.orderId}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{o.customer?.name}</p>
                      <p className="text-xs text-gray-400">{o.customer?.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{o.items?.length} items</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[140px] truncate">{o.deliveryAddress?.city}</td>
                    <td className="px-4 py-3 font-bold text-green-700">₹{o.pricing?.total}</td>
                    <td className="px-4 py-3 capitalize text-gray-600">{o.payment?.method}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>{o.status?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
