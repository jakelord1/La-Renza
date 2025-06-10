import React, { useEffect, useState } from 'react';

const CategoryTabs = ({ active, setActive }) => {
  const [tabs, setTabs] = useState(['Усі']);
  useEffect(() => {
    let categories = [];
    let tabsIds = [];
 
    fetch('/api/Configurator')
      .then(res => res.ok ? res.json() : null)
      .then(configData => {
        if (!configData) return;
        const tabsConfig = configData.find(item => item.name === 'Категорії для табів');
        tabsIds = Array.isArray(tabsConfig?.value) ? tabsConfig.value : [];
 
        return fetch(`${import.meta.env.VITE_BACKEND_API_LINK}/api/Categories`)
          .then(res => res.ok ? res.json() : [])
          .then(allCats => {
            categories = Array.isArray(allCats) ? allCats : [];
 
            const orderedTabs = tabsIds
              .map(id => categories.find(cat => cat.id === id))
              .filter(Boolean);
            setTabs(['Усі', ...orderedTabs.map(cat => cat.name)]);
          });
      })
      .catch(() => setTabs(['Усі']));
  }, []);

  const handleClick = (tab, e) => {
    e.preventDefault();
    setActive(tab);
    const button = e.currentTarget;
    button.blur();
    button.focus();
  };

  return (
    <div className="container mb-3">
      <div className="d-flex justify-content-center flex-wrap gap-2">
        {tabs.map(tab => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link category-tab-btn${active === tab ? ' active' : ''}`}
              onClick={(e) => handleClick(tab, e)}
              onMouseDown={(e) => e.preventDefault()}
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
