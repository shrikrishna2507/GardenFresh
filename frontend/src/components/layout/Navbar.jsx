import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiLogOut, FiSettings } from 'react-icons/fi'
import { MdOutlineLocalFlorist } from 'react-icons/md'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems }   = useCart()
  const navigate         = useNavigate()
  const location         = useLocation()
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [userOpen,  setUserOpen]  = useState(false)
  const [search,    setSearch]    = useState('')

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/marketplace?search=${encodeURIComponent(search)}`)
  }

  function getDashboardLink() {
    const map = { farmer: '/farmer', admin: '/admin', delivery: '/delivery', customer: '/dashboard' }
    return map[user?.role] || '/dashboard'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <MdOutlineLocalFlorist className="text-green-600 text-2xl" />
            <span className="font-bold text-xl text-gray-900">Garden<span className="text-green-600">Fresh</span></span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tomatoes, mangoes, herbs..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </form>

          {/* Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/marketplace" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/marketplace' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              Shop
            </Link>
            <Link to="/about" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
              About
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors ml-1">
              <FiShoppingCart className="text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative ml-1">
                <button onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                      </div>
                      <Link to={getDashboardLink()} onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <FiSettings className="text-gray-400" /> Dashboard
                      </Link>
                      <button onClick={() => { logout(); setUserOpen(false); navigate('/'); }}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <FiLogOut /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="relative p-2">
              <FiShoppingCart className="text-xl text-gray-600" />
              {totalItems > 0 && <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{totalItems}</span>}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-600">
              {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white">
            <div className="page-container py-4 space-y-1">
              <form onSubmit={handleSearch} className="mb-3">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search produce..." className="input-field pl-10" />
                </div>
              </form>
              <Link to="/marketplace" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">Shop</Link>
              <Link to="/about" onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">About</Link>
              {user ? (
                <>
                  <Link to={getDashboardLink()} onClick={() => setMenuOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50">Dashboard</Link>
                  <button onClick={() => { logout(); setMenuOpen(false); navigate('/'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 rounded-xl hover:bg-red-50">Logout</button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium border border-gray-200 rounded-xl">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="flex-1 text-center btn-primary text-sm py-2.5">Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
