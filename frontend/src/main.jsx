import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
          <Toaster position="top-right" toastOptions={{
            style: { borderRadius: '12px', fontFamily: 'Inter, sans-serif', fontSize: '14px' },
            success: { iconTheme: { primary: '#2d9d5f', secondary: '#fff' } }
          }} />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
