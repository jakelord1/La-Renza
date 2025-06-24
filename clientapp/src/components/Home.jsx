import React, { useState } from 'react';
import CategoryList from './CategoryList';
import MainBanner from './MainBanner';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import FooterEmailSubscribe from './FooterEmailSubscribe';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Усі');

  return (
    <div className="larenza-font">
      <CategoryList />
      <MainBanner />
      <CategoryTabs active={activeTab} setActive={setActiveTab} />
      <ProductGrid activeCategory={activeTab} />
      <FooterEmailSubscribe />
    </div>
  );
};

export default Home;