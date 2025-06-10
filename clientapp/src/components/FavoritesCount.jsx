import React, { useState, useEffect } from 'react';

const getFavorites = () => {
  try {
    return JSON.parse(localStorage.getItem('favorites')) || [];
  } catch {
    return [];
  }
};

const FavoritesCount = () => {
  const [count, setCount] = useState(getFavorites().length);

  useEffect(() => {
    const update = () => setCount(getFavorites().length);
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
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