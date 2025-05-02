import React from 'react';
import ProductCard from './ProductCard';

const mockProducts = [
  {
    id: 1,
    name: 'Плед "Soft Home"',
    price: '1499',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    originalPrice: '1799',
    sale: true
  },
  {
    id: 2,
    name: 'Набір рушників',
    price: '899',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 3,
    name: 'Декоративна подушка',
    price: '1199',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 4,
    name: 'Керамічна кружка',
    price: '499',
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 5,
    name: 'Кошик для зберігання',
    price: '799',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 6,
    name: 'Ароматична свічка',
    price: '599',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 7,
    name: 'Святкова скатертина',
    price: '1299',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 8,
    name: 'Домашні тапочки',
    price: '699',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80',
    originalPrice: '899',
    sale: true
  },
  {
    id: 9,
    name: 'Килимок для ванної кімнати',
    price: '499',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 10,
    name: 'Коробка для зберігання',
    price: '599',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 11,
    name: 'Жіноча піжама',
    price: '1799',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 12,
    name: 'Комплект для кухні',
    price: '999',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  }
];

const ProductGrid = () => (
  <div className="container">
    <div className="row g-3 g-md-4">
      {mockProducts.map(product => (
        <div className="col-6 col-md-4 col-lg-3" key={product.id}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  </div>
);

export default ProductGrid;
