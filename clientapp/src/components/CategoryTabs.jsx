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

const CategoryTabs = ({ active, setActive }) => (
  <div className="container mb-3">
    <ul className="nav nav-pills justify-content-center flex-wrap gap-2 category-tabs-custom">
      {tabs.map(tab => (
        <li className="nav-item" key={tab}>
          <button
            className={`nav-link category-tab-btn${active === tab ? ' active' : ''}`}
            onClick={() => setActive(tab)}
          >
            {tab}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

export default CategoryTabs;
