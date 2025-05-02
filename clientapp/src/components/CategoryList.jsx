import React from 'react';

const categories = [
  { name: 'Одяг', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80' },
  { name: 'Взуття', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80' },
  { name: 'Аксесуари', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80' },
  { name: 'Для дому', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80' },
  { name: 'Дітям', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
  { name: 'Сад і балкон', img: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=80&q=80' },
  { name: 'Косметика', img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=80&q=80' },
  { name: 'Білизна', img: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=80&q=80' },
  { name: 'Подарунки', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80' },
  { name: 'Текстиль', img: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=80&q=80' },
  { name: 'Кухня', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80' },
  { name: 'Спорт', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80' },
];

const CategoryList = ({ onCategoryClick }) => (
  <div className="container py-4">
    <div className="d-flex flex-nowrap overflow-auto gap-3 justify-content-center">
      {categories.map((cat, idx) => (
        <div key={idx} className="text-center" style={{ minWidth: 90, cursor: 'pointer' }} onClick={() => onCategoryClick && onCategoryClick(cat)}>
          <img src={cat.img} alt={cat.name} className="rounded-circle border border-2 border-purple mb-2" style={{ width: 64, height: 64, objectFit: 'cover' }} />
          <div className="fw-semibold small text-dark">{cat.name}</div>
        </div>
      ))}
    </div>
  </div>
);

export default CategoryList;
