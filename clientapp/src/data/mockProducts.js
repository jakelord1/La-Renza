// Моки для продуктов. Реализуйте структуру по необходимости для ProductDetails
const mockProducts = [
  {
    id: 1,
    name: 'Плед "Soft Home"',
    price: '1499',
    originalPrice: '1799',
    sale: true,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
    ],
    sizes: ['S', 'M', 'L'],
    description: 'М’який плед для затишку у вашому домі.',
    features: ['100% бавовна', 'Розмір: 150х200 см', 'Колір: сірий'],
    badges: ['НОВИНКА', 'ХІТ ПРОДАЖУ'],
    inStock: true,
    isNew: true,
    isBestseller: true,
    isWow: false
  },
  {
    id: 2,
    name: 'Набір рушників',
    price: '899',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    ],
    sizes: ['M', 'L'],
    description: 'Комплект рушників для ванної кімнати.',
    features: ['100% бавовна', 'Розмір: 70х140 см', '2 шт.'],
    badges: ['ЦІНИ ВАУ!'],
    inStock: true,
    isNew: false,
    isBestseller: false,
    isWow: true
  },
  {
    id: 3,
    name: 'Декоративна подушка',
    price: '1199',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    images: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
    ],
    sizes: ['S', 'M'],
    description: 'Декоративна подушка для вашого інтер’єру.',
    features: ['Гіпоалергенний наповнювач', 'Розмір: 40х40 см'],
    badges: [],
    inStock: false,
    isNew: false,
    isBestseller: false,
    isWow: false
  }
];

export default mockProducts;
