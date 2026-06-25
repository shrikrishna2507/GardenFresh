import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdOutlineLocalFlorist } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const roles = [
  { value: 'customer', label: '🛒 Customer', desc: 'Buy fresh produce' },
  { value: 'farmer',   label: '🌱 Grower/Farmer', desc: 'Sell your harvest' },
  { value: 'delivery', label: '🚚 Delivery Partner', desc: 'Deliver orders' },
]

export default function Register() {
  const { register } = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ name: '', email: '', phone: '', password: '', role: 'customer' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) return toast.error('Fill in all required fields')
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    try {
      const user = await register(form)
      const routes = { farmer: '/farmer/setup', customer: '/marketplace', delivery: '/delivery' }
      navigate(routes[user.role] || '/marketplace')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">

        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <MdOutlineLocalFlorist className="text-green-600 text-3xl" />
          <span className="font-bold text-2xl text-gray-900">Garden<span className="text-green-600">Fresh</span></span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create account</h1>
          <p className="text-gray-500 text-sm mb-6">Join the GardenFresh community</p>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button key={r.value} type="button" onClick={() => setForm(p => ({ ...p, role: r.value }))}
                className={`p-3 rounded-xl border-2 text-left transition-all ${form.role === r.value ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-200'}`}>
                <div className="text-lg mb-0.5">{r.label.split(' ')[0]}</div>
                <div className="text-xs font-semibold text-gray-700">{r.label.split(' ').slice(1).join(' ')}</div>
                <div className="text-xs text-gray-400">{r.desc}</div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field pl-10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Min 6 characters" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
