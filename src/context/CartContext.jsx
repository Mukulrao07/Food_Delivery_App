import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem('cart_v1');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('cart_v1', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  function addItem(item, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((p) => String(p.id) === String(item.id));
      if (existing) {
        return prev.map((p) => (String(p.id) === String(item.id) ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });
  }

  function removeItem(id) {
    setCart((prev) => prev.filter((p) => String(p.id) !== String(id)));
  }

  function updateQty(id, qty) {
    setCart((prev) => prev.map((p) => (String(p.id) === String(id) ? { ...p, qty: Math.max(1, qty) } : p)));
  }

  function clearCart() {
    setCart([]);
  }

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}

export default CartContext;
