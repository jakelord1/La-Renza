import React, { useEffect, useState } from 'react';

const CategoryList = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Categories`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex flex-nowrap overflow-auto gap-3 justify-content-center">
        {categories.map((cat, idx) => (
          <div key={cat.id || idx} className="text-center" style={{ minWidth: 90, cursor: 'pointer' }} onClick={() => onCategoryClick && onCategoryClick(cat)}>
            <img src={cat.image || cat.img} alt={cat.name} className="rounded-circle border border-2 border-purple mb-2" style={{ width: 64, height: 64, objectFit: 'cover' }} />
            <div className="fw-semibold small text-dark">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
