import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import { MdOutlineLocalFlorist } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e) { setForm(p => ({ ...p, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) return toast.error('Fill in all fields')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const routes = { farmer: '/farmer', admin: '/admin', delivery: '/delivery', customer: '/marketplace' }
      navigate(routes[user.role] || '/marketplace')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  // Quick login helpers
  function quickLogin(email, password) { setForm({ email, password }) }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <MdOutlineLocalFlorist className="text-green-600 text-3xl" />
          <span className="font-bold text-2xl text-gray-900">Garden<span className="text-green-600">Fresh</span></span>
        </Link>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-7">Sign in to your GardenFresh account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  placeholder="you@example.com" className="input-field pl-10" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input name="password" type={showPw ? 'text' : 'password'} value={form.password} onChange={handleChange}
                  placeholder="••••••••" className="input-field pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-5 p-4 bg-gray-50 rounded-xl">
            <p className="text-xs font-semibold text-gray-500 mb-2">Quick Demo Login:</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Customer', 'rahul@gardenfresh.com', 'Customer@123'],
                ['Farmer',   'krishna@gardenfresh.com', 'Farmer@123'],
                ['Admin',    'admin@gardenfresh.com', 'Admin@123'],
              ].map(([role, email, pw]) => (
                <button key={role} onClick={() => quickLogin(email, pw)}
                  className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-left hover:border-green-300 hover:bg-green-50 transition-colors">
                  <span className="font-semibold text-gray-700 block">{role}</span>
                  <span className="text-gray-400">{email}</span>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
