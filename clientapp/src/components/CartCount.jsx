import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_API_LINK;

const CartCount = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    let isLoggedIn = false;
    try {
      const res = await fetch(`${API_URL}/api/Account/accountProfile`, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        isLoggedIn = !!data && !!data.email;
      }
    } catch {}
    if (isLoggedIn) {
      try {
        const res = await fetch(`${API_URL}/api/Account/accountShoppingCarts`, { credentials: 'include' });
        if (!res.ok) {
          setCount(0);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setCount(data.reduce((sum, item) => sum + (item.quantity || 1), 0));
        } else {
          setCount(0);
        }
      } catch {
        setCount(0);
      }
    } else {
      try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        setCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
      } catch {
        setCount(0);
      }
    }
  };

  useEffect(() => {
    fetchCount();
    window.addEventListener('cart-updated', fetchCount);
    return () => window.removeEventListener('cart-updated', fetchCount);
  }, []);

  if (count === 0) return null;
  return (
    <span
      className="position-absolute top-0 start-100 translate-middle badge rounded-pill text-white"
      style={{ background: 'var(--purple)' }}
    >
      {count}
    </span>
  );
};

export default CartCount;
