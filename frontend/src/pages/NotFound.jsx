import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page-container py-28 text-center">
      <div className="text-8xl mb-6">🌿</div>
      <h1 className="text-5xl font-black text-gray-900 mb-3">404</h1>
      <h2 className="text-2xl font-bold text-gray-700 mb-3">Page Not Found</h2>
      <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like this page wandered off into the garden. Let's get you back on track.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">Go Home</Link>
        <Link to="/marketplace" className="btn-secondary">Browse Marketplace</Link>
      </div>
    </div>
  )
}
