import React from 'react';

const QuickViewModal = () => {
  return (
    <div className="modal fade" id="quickViewModal" tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header border-0">
            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="product-gallery">
                  <img src="" id="modalProductImage" className="img-fluid" alt="Product" />
                </div>
              </div>
              <div className="col-md-6">
                <h3 id="modalProductName"></h3>
                <div className="price-wrapper mb-3">
                  <span className="price" id="modalProductPrice"></span>
                  <span className="price-original" id="modalProductOriginalPrice"></span>
                </div>
                <div className="product-description mb-4">
                  <p id="modalProductDescription"></p>
                </div>
                <div className="size-selector mb-4">
                  <button className="size-btn">XS</button>
                  <button className="size-btn">S</button>
                  <button className="size-btn">M</button>
                  <button className="size-btn">L</button>
                  <button className="size-btn">XL</button>
                </div>
                <button className="btn btn-dark w-100" onClick={() => console.log('Add to cart')}>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal; 