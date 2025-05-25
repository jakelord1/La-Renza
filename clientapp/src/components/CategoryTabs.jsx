import React from 'react';

const tabs = [
  'Усі',
  'Одяг',
  'Взуття',
  'Аксесуари',
  'Для дому',
  'Дітям',
  'Сад і балкон',
];

const CategoryTabs = ({ active, setActive }) => {
  const handleClick = (tab, e) => {
    e.preventDefault();
    setActive(tab);
    // Force a reflow to ensure the active class is applied immediately
    const button = e.currentTarget;
    button.blur();
    button.focus();
  };

  return (
    <div className="container mb-3">
      <ul className="nav nav-pills justify-content-center flex-wrap gap-2 category-tabs-custom">
        {tabs.map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link category-tab-btn${active === tab ? ' active' : ''}`}
              onClick={(e) => handleClick(tab, e)}
              onMouseDown={(e) => e.preventDefault()} // Prevent focus loss on mousedown
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryTabs;
