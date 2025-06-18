import React, { useEffect, useState } from 'react';

const CategoryTabs = ({ active, setActive }) => {
  const [tabs, setTabs] = useState([{ id: 'Усі', name: 'Усі' }]);
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
            setTabs([{ id: 'Усі', name: 'Усі' }, ...orderedTabs.map(cat => ({ id: cat.id, name: cat.name }))]);
          });
      })
      .catch(() => setTabs(['Усі']));
  }, []);

  const handleClick = (tabId, e) => {
    e.preventDefault();
    setActive(tabId);
    const button = e.currentTarget;
    button.blur();
    button.focus();
  };

  return (
    <div className="container mb-3">
      <div className="d-flex justify-content-center flex-wrap gap-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`category-tab-btn-admin${active === tab.id ? ' active' : ''}`}
            onClick={(e) => handleClick(tab.id, e)}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              background: active === tab.id ? '#6f42c1' : '#fff',
              color: active === tab.id ? '#fff' : '#6f42c1',
              border: '1.5px solid #6f42c1',
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 16,
              minWidth: 90,
              minHeight: 38,
              boxShadow: active === tab.id ? '0 2px 8px #a259e633' : 'none',
              transition: 'all 0.2s',
              outline: 'none',
              padding: '7px 20px',
              marginBottom: 2
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
