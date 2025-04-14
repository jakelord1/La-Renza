import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ProductCard from './ProductCard';

const featuredProducts = [
  {
    id: 1,
    name: 'Floral Summer Dress',
    price: '49.99',
    image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Light and breezy floral summer dress perfect for warm days.'
  },
  {
    id: 2,
    name: 'Casual Blazer',
    price: '79.99',
    originalPrice: '99.99',
    sale: true,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Classic casual blazer perfect for any occasion.'
  },
  {
    id: 3,
    name: 'Summer Blouse',
    price: '39.99',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Light and elegant summer blouse for a casual look.'
  },
  {
    id: 4,
    name: 'Denim Jacket',
    price: '69.99',
    image: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    description: 'Classic denim jacket that never goes out of style.'
  }
];

const Home = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <>
      <section className="hero-section" data-aos="fade-up">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-light text-dark mb-3" data-aos="fade-right" data-aos-delay="200">
                NEW COLLECTION 2025
              </span>
              <h1 className="display-4 fw-bold text-white mb-4" data-aos="fade-right" data-aos-delay="300">
                New Summer Collection
              </h1>
              <p className="lead text-white-50 mb-4" data-aos="fade-right" data-aos-delay="400">
                Discover the latest trends in fashion with our exclusive summer pieces. Up to 40% off on selected items.
              </p>
              <div className="d-flex gap-3" data-aos="fade-right" data-aos-delay="500">
                <Link to="/login" className="btn btn-purple btn-lg">Shop Now</Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">View Lookbook</Link>
              </div>
              <div className="mt-5 d-flex gap-4" data-aos="fade-up" data-aos-delay="600">
                <div className="feature-item">
                  <i className="bi bi-truck text-purple mb-2"></i>
                  <p className="mb-0 small">Free Shipping</p>
                </div>
                <div className="feature-item">
                  <i className="bi bi-shield-check text-purple mb-2"></i>
                  <p className="mb-0 small">Secure Payment</p>
                </div>
                <div className="feature-item">
                  <i className="bi bi-arrow-counterclockwise text-purple mb-2"></i>
                  <p className="mb-0 small">Easy Returns</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-block" data-aos="fade-left" data-aos-delay="300">
              <div className="hero-image-grid">
                <div className="image-container main-image">
                  <img 
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Fashion Model in Yellow"
                    loading="eager"
                  />
                </div>
                <div className="image-container secondary-image">
                  <img 
                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Fashion Model in White"
                    loading="eager"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products py-5">
        <div className="container">
          <h2 className="text-center mb-5 text-dark" data-aos="fade-up">Featured Products</h2>
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-6 col-md-4 col-lg-3" data-aos="fade-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="newsletter py-5" data-aos="fade-up">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-6">
              <h3 className="text-white">Subscribe to Our Newsletter</h3>
              <p className="text-white-50">Get the latest updates and special offers</p>
              <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group mb-3">
                  <input type="email" className="form-control" placeholder="Enter your email" />
                  <button className="btn btn-purple" type="submit">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

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
                  <button className="btn btn-dark w-100">Add to Cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home; 