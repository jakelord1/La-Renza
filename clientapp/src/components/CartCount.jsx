import React, { useState, useEffect } from 'react';

const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch {
    return [];
  }
};

const getTotalCount = () => {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
};

const CartCount = () => {
  const [count, setCount] = useState(getTotalCount());

  useEffect(() => {
    const update = () => setCount(getTotalCount());
    window.addEventListener('cart-updated', update);
    return () => window.removeEventListener('cart-updated', update);
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
