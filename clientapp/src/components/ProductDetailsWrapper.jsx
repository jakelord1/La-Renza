import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import Loader from './common/Loader';

const MODELS_API_URL = '/api/Models';
const PRODUCTS_API_URL = '/api/Products';
const COMMENTS_API_URL = '/api/Comments';

const ProductDetailsWrapper = () => {
  const { id } = useParams();
  const [model, setModel] = useState(null);
  const [products, setProducts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [modelsRes, productsRes, commentsRes] = await Promise.all([
          fetch(MODELS_API_URL),
          fetch(PRODUCTS_API_URL),
          fetch(COMMENTS_API_URL)
        ]);
        if (!modelsRes.ok) throw new Error('Помилка завантаження моделей');
        if (!productsRes.ok) throw new Error('Помилка завантаження продуктів');
        if (!commentsRes.ok) throw new Error('Помилка завантаження коментарів');
        const modelsData = await modelsRes.json();
        const productsData = await productsRes.json();
        const commentsData = await commentsRes.json();


        const foundModel = modelsData.find(m => String(m.id) === String(id));
        if (!foundModel) throw new Error('Товар не знайдено');

        const modelProducts = productsData.filter(
          p => p.color && p.color.model && String(p.color.model.id) === String(id)
        );
        setModel(foundModel);
        setProducts(modelProducts);
        setComments(commentsData);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!model) return <div>Товар не знайдено</div>;

  return <ProductDetails model={model} products={products} comments={comments} />;
};

export default ProductDetailsWrapper;
