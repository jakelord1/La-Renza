import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import mockProducts from '../data/mockProducts';

const ProductDetailsWrapper = () => {
  const { id } = useParams();
  // Найти товар по id
  const product = mockProducts.find(p => String(p.id) === String(id));
  return <ProductDetails product={product} />;
};

export default ProductDetailsWrapper;
