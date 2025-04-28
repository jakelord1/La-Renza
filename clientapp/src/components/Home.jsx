import React, { useState } from 'react';
import CategoryList from './CategoryList';
import MainBanner from './MainBanner';
import CategoryTabs from './CategoryTabs';
import ProductGrid from './ProductGrid';
import FooterEmailSubscribe from './FooterEmailSubscribe';

const Home = () => {
  const [activeTab, setActiveTab] = useState('Усі');

  return (
    <>
      {/* Navbar буде під PromoBanner, якщо Navbar додається на рівні App або Layout */}
      <CategoryList />
      <MainBanner />
      <CategoryTabs active={activeTab} setActive={setActiveTab} />
      <ProductGrid />
      <FooterEmailSubscribe />
    </>
  );
};

export default Home;