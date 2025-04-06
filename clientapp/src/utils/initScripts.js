import AOS from 'aos';

export const initScripts = () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
    offset: 100
  });
};

export const openQuickView = (product) => {
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    const modalImage = document.getElementById('modalProductImage');
    const modalName = document.getElementById('modalProductName');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalOriginalPrice = document.getElementById('modalProductOriginalPrice');
    const modalDescription = document.getElementById('modalProductDescription');

    if (modalImage) modalImage.src = product.image;
    if (modalName) modalName.textContent = product.name;
    if (modalPrice) modalPrice.textContent = `$${product.price}`;
    if (modalOriginalPrice) {
      modalOriginalPrice.textContent = product.originalPrice ? `$${product.originalPrice}` : '';
    }
    if (modalDescription) modalDescription.textContent = product.description;

    // @ts-ignore
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
  }
}; 