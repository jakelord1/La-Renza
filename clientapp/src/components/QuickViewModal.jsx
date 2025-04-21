import React from 'react';

const isFavorite = (product) => {
  try {
    const favs = JSON.parse(localStorage.getItem('favorites')) || [];
    return favs.some((item) => item.id === product.id);
  } catch {
    return false;
  }
};

const toggleFavorite = (product) => {
  let favs = [];
  try {
    favs = JSON.parse(localStorage.getItem('favorites')) || [];
  } catch {}
  if (favs.some((item) => item.id === product.id)) {
    favs = favs.filter((item) => item.id !== product.id);
  } else {
    favs.push(product);
  }
  localStorage.setItem('favorites', JSON.stringify(favs));
  window.dispatchEvent(new Event('favorites-updated'));
};

const QuickViewModal = ({ product }) => {
  const [favorite, setFavorite] = React.useState(isFavorite(product));

  React.useEffect(() => {
    const update = () => setFavorite(isFavorite(product));
    window.addEventListener('favorites-updated', update);
    return () => window.removeEventListener('favorites-updated', update);
  }, [product]);

  if (!product) return null;

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
                  <img src={product.image} className="img-fluid" alt="Product" />
                </div>
              </div>
              <div className="col-md-6">
                <h3>{product.name}</h3>
                <p className="price">
                  {product.originalPrice && <span className="price-original">${product.originalPrice}</span>}
                  <span>${product.price}</span>
                </p>
                <button
                  className="btn btn-light mb-3"
                  onClick={() => toggleFavorite(product)}
                  aria-label={favorite ? 'Удалить из избранного' : 'Добавить в избранное'}
                >
                  <i className={`bi ${favorite ? 'bi-heart-fill text-danger' : 'bi-heart'} fs-5`}></i>
                  {favorite ? ' Удалить из избранного' : ' В избранное'}
                </button>
                <div className="mb-3">
                  <div className="d-flex gap-2">
                    <button className="size-btn">XS</button>
                    <button className="size-btn">S</button>
                    <button className="size-btn">M</button>
                    <button className="size-btn">L</button>
                    <button className="size-btn">XL</button>
                  </div>
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