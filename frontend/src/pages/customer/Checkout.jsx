import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiCreditCard } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderAPI } from '../../services/api'
import toast from 'react-hot-toast'

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart()
  const { user }   = useAuth()
  const navigate   = useNavigate()
  const [loading, setLoading] = useState(false)
  const [step, setStep]       = useState(1) // 1=address, 2=payment
  const [address, setAddress] = useState({
    name: user?.name || '', phone: user?.phone || '',
    line1: '', city: '', state: 'Karnataka', pincode: '',
  })
  const [payMethod, setPayMethod] = useState('cod')

  function handleAddressChange(e) { setAddress(p => ({ ...p, [e.target.name]: e.target.value })) }

  async function placeOrder() {
    if (!address.name || !address.phone || !address.line1 || !address.city || !address.pincode) {
      return toast.error('Please fill all address fields')
    }
    setLoading(true)
    try {
      const res = await orderAPI.create({
        items: cart.map(i => ({ product: i._id, quantity: i.cartQty, name: i.name })),
        deliveryAddress: address,
        payment: { method: payMethod },
      })
      clearCart()
      navigate(`/order-success/${res.data.order._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Try again.')
    } finally { setLoading(false) }
  }

  const deliveryCharge = totalPrice >= 300 ? 0 : 30
  const total = totalPrice + deliveryCharge

  return (
    <div className="page-container py-8 max-w-5xl">
      <h1 className="text-2xl font-black text-gray-900 mb-6">Checkout</h1>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-8">
        {[['1', 'Delivery Address'], ['2', 'Payment']].map(([s, l]) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${+s <= step ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>{s}</div>
            <span className={`text-sm font-medium ${+s <= step ? 'text-gray-900' : 'text-gray-400'}`}>{l}</span>
            {s === '1' && <div className="w-12 h-0.5 bg-gray-200 ml-2" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><FiMapPin className="text-green-500" /> Delivery Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[['name', 'Full Name', 'text'], ['phone', 'Phone Number', 'tel'], ['line1', 'House / Street', 'text'], ['city', 'City', 'text'], ['state', 'State', 'text'], ['pincode', 'Pincode', 'text']].map(([name, label, type]) => (
                  <div key={name} className={name === 'line1' ? 'sm:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{label} *</label>
                    <input name={name} type={type} value={address[name]} onChange={handleAddressChange} className="input-field" placeholder={label} />
                  </div>
                ))}
              </div>
              <button onClick={() => setStep(2)} className="btn-primary mt-6 w-full py-3">Continue to Payment →</button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="font-bold text-gray-900 mb-5 flex items-center gap-2"><FiCreditCard className="text-green-500" /> Payment Method</h2>
              <div className="space-y-3">
                {[
                  { val: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                  { val: 'upi', icon: '📱', label: 'UPI / GPay / PhonePe', desc: 'Instant payment via UPI' },
                  { val: 'razorpay', icon: '💳', label: 'Card / Net Banking', desc: 'Secure payment via Razorpay' },
                ].map(opt => (
                  <label key={opt.val} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === opt.val ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                    <input type="radio" name="payment" value={opt.val} checked={payMethod === opt.val} onChange={e => setPayMethod(e.target.value)} className="accent-green-600 w-4 h-4" />
                    <span className="text-2xl">{opt.icon}</span>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="btn-secondary py-3 px-6">← Back</button>
                <button onClick={placeOrder} disabled={loading} className="flex-1 btn-orange py-3 font-bold disabled:opacity-60">
                  {loading ? 'Placing Order...' : `Place Order · ₹${total.toFixed(0)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-24">
          <h3 className="font-bold text-gray-900 mb-4">Your Order</h3>
          <div className="space-y-2 mb-4">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-gray-600 truncate mr-2">{item.name} × {item.cartQty}</span>
                <span className="font-medium shrink-0">₹{(item.price * item.cartQty).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-dashed border-gray-100 pt-3 space-y-1.5 mb-4">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subtotal</span><span>₹{totalPrice.toFixed(0)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Delivery</span>
              <span className={deliveryCharge === 0 ? 'text-green-600 font-medium' : ''}>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
            </div>
          </div>
          <div className="flex justify-between font-black text-base">
            <span>Total</span><span className="text-green-700">₹{total.toFixed(0)}</span>
          </div>
          <p className="text-xs text-green-600 mt-3 text-center">🚚 Estimated delivery within 2 hours</p>
        </div>
      </div>
    </div>
  )
}
