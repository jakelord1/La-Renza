import React from 'react';

const ProductCard = ({ product }) => {
  const handleQuickView = () => {

    console.log('Quick view:', product);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.sale && <span className="badge badge-sale">SALE</span>}
        <img src={product.image} className="img-fluid" alt={product.name} />
        <div className="product-overlay">
          <button className="btn btn-light" onClick={handleQuickView}>Quick View</button>
        </div>
      </div>
      <div className="product-info p-3">
        <h5>{product.name}</h5>
        <p>
          {product.originalPrice && (
            <span className="price-original">${product.originalPrice}</span>
          )}
          <span className="price">${product.price}</span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard; 