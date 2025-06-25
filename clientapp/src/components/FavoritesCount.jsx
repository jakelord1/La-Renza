import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_BACKEND_API_LINK;

const FavoritesCount = () => {
  const [count, setCount] = useState(0);

  const fetchCount = async () => {
    try {
      const res = await fetch(`${API_URL}/api/Account/accountModels`, { credentials: 'include' });
      if (!res.ok) {
        setCount(0);
        return;
      }
      const data = await res.json();
      setCount(Array.isArray(data) ? data.length : 0);
    } catch {
      setCount(0);
    }
  };

  useEffect(() => {
    fetchCount();
    window.addEventListener('favorites-updated', fetchCount);
    return () => window.removeEventListener('favorites-updated', fetchCount);
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

export default FavoritesCount; 