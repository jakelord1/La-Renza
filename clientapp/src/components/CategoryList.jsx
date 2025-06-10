import React, { useEffect, useState } from 'react';

const CategoryList = ({ onCategoryClick }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
 
    fetch('/api/Configurator')
      .then(res => res.ok ? res.json() : null)
      .then(configData => {
        if (!configData) return setCategories([]);
        const catConf = configData.find(item => item.name === 'Категорії');
        const ids = Array.isArray(catConf?.value) ? catConf.value : [];
        if (!ids.length) return setCategories([]);
 
        fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Categories`)
          .then(res => res.ok ? res.json() : [])
          .then(allCats => {
 
            const filtered = ids
              .map(id => allCats.find(cat => cat.id === id))
              .filter(Boolean);
            setCategories(filtered);
          })
          .catch(() => setCategories([]));
      })
      .catch(() => setCategories([]));
  }, []);

  return (
    <div className="container py-4">
      <div className="d-flex flex-nowrap overflow-auto gap-3 justify-content-center">
        {categories.map((cat, idx) => (
          <div key={cat.id || idx} className="text-center" style={{ minWidth: 90, cursor: 'pointer' }} onClick={() => onCategoryClick && onCategoryClick(cat)}>
            <img
  src={cat.image?.path ? cat.image.path.replace(/^\/public/, '') : '/images/no-image.jpg'}
  alt={cat.name}
  className="rounded-circle border border-2 border-purple mb-2"
  style={{ width: 64, height: 64, objectFit: 'cover', background: '#eee' }}
/>
            <div className="fw-semibold small text-dark">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
