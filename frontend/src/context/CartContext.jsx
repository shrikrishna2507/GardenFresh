import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gf_cart')) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('gf_cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product, qty = 1) {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) {
        toast.success(`${product.name} quantity updated`);
        return prev.map(i => i._id === product._id ? { ...i, cartQty: i.cartQty + qty } : i);
      }
      toast.success(`${product.name} added to cart 🛒`);
      return [...prev, { ...product, cartQty: qty }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i._id !== id));
  }

  function updateQty(id, qty) {
    if (qty < 1) return removeFromCart(id);
    setCart(prev => prev.map(i => i._id === id ? { ...i, cartQty: qty } : i));
  }

  function clearCart() { setCart([]); }

  const totalItems = cart.reduce((s, i) => s + i.cartQty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.cartQty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
