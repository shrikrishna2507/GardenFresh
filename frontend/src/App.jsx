import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Spinner from './components/common/Spinner'

// Pages
import Landing       from './pages/Landing'
import Login         from './pages/auth/Login'
import Register      from './pages/auth/Register'
import Marketplace   from './pages/customer/Marketplace'
import ProductDetail from './pages/customer/ProductDetail'
import FarmProfile   from './pages/customer/FarmProfile'
import Cart          from './pages/customer/Cart'
import Checkout      from './pages/customer/Checkout'
import OrderSuccess  from './pages/customer/OrderSuccess'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import FarmerDashboard   from './pages/farmer/FarmerDashboard'
import FarmerProducts    from './pages/farmer/FarmerProducts'
import FarmerOrders      from './pages/farmer/FarmerOrders'
import FarmSetup         from './pages/farmer/FarmSetup'
import AdminDashboard    from './pages/admin/AdminDashboard'
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'
import AboutUs       from './pages/AboutUs'
import Contact       from './pages/Contact'
import NotFound      from './pages/NotFound'

// Route guard
function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner fullPage />
  if (!user)   return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { loading } = useAuth()
  if (loading) return <Spinner fullPage />

  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<Layout><Landing /></Layout>} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/marketplace" element={<Layout><Marketplace /></Layout>} />
      <Route path="/product/:id"  element={<Layout><ProductDetail /></Layout>} />
      <Route path="/farm/:slug"   element={<Layout><FarmProfile /></Layout>} />
      <Route path="/cart"    element={<Layout><Cart /></Layout>} />
      <Route path="/about"   element={<Layout><AboutUs /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />

      {/* Customer */}
      <Route path="/checkout"      element={<PrivateRoute><Layout><Checkout /></Layout></PrivateRoute>} />
      <Route path="/order-success/:id" element={<PrivateRoute><Layout><OrderSuccess /></Layout></PrivateRoute>} />
      <Route path="/dashboard"     element={<PrivateRoute roles={['customer']}><Layout><CustomerDashboard /></Layout></PrivateRoute>} />

      {/* Farmer */}
      <Route path="/farmer"          element={<PrivateRoute roles={['farmer']}><Layout><FarmerDashboard /></Layout></PrivateRoute>} />
      <Route path="/farmer/products" element={<PrivateRoute roles={['farmer']}><Layout><FarmerProducts /></Layout></PrivateRoute>} />
      <Route path="/farmer/orders"   element={<PrivateRoute roles={['farmer']}><Layout><FarmerOrders /></Layout></PrivateRoute>} />
      <Route path="/farmer/setup"    element={<PrivateRoute roles={['farmer']}><Layout><FarmSetup /></Layout></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin/*" element={<PrivateRoute roles={['admin']}><AdminDashboard /></PrivateRoute>} />

      {/* Delivery */}
      <Route path="/delivery" element={<PrivateRoute roles={['delivery']}><Layout><DeliveryDashboard /></Layout></PrivateRoute>} />

      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  )
}
