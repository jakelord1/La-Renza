import React from 'react';

const mockWishlist = [
  {
    id: 1,
    name: 'Floral Summer Dress',
    price: '49.99',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 2,
    name: 'Casual Blazer',
    price: '79.99',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    inStock: true
  },
  {
    id: 3,
    name: 'Denim Jacket',
    price: '69.99',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    inStock: false
  }
];

const AccountWishlist = () => {
  return (
    <div className="account-content">
      <h2 className="mb-4">My Wishlist</h2>
      <div className="row">
        {mockWishlist.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="position-relative">
                <img 
                  src={item.image} 
                  className="card-img-top" 
                  alt={item.name}
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <button 
                  className="btn btn-sm btn-outline-danger position-absolute"
                  style={{ top: '10px', right: '10px' }}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">
                  <span className="text-primary fw-bold">${item.price}</span>
                </p>
                <div className="d-grid gap-2">
                  <button 
                    className={`btn ${item.inStock ? 'btn-purple' : 'btn-secondary'}`}
                    disabled={!item.inStock}
                  >
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountWishlist; 