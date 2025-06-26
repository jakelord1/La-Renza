import React, { useState } from 'react';

// Helper: find all parent ids for selected category
function findOpenPath(categories, selectedId) {
  const map = {};
  function buildMap(list, parentId = null) {
    list.forEach(cat => {
      map[cat.id] = parentId;
      if (cat.children?.length) buildMap(cat.children, cat.id);
    });
  }
  buildMap(categories);
  const path = [];
  let current = selectedId;
  while (map[current]) {
    path.unshift(map[current]);
    current = map[current];
  }
  return path;
}

const CategoryTree = ({ categories, selected, onSelect }) => {
  const selectedId = selected && selected.length ? selected[0] : null;
  const openIds = selectedId ? findOpenPath(categories, selectedId) : [];
  return (
    <ul className="list-unstyled mb-0 ps-1">
      {categories.map(cat => (
        <CategoryNode key={cat.id} cat={cat} selected={selected} onSelect={onSelect} openIds={openIds} />
      ))}
    </ul>
  );
};

const CategoryNode = ({ cat, selected, onSelect, openIds = [] }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = cat.children && cat.children.length > 0;
  const isSelected = selected.includes(cat.id);

  // Открывать если id есть в openIds
  React.useEffect(() => {
    if (openIds.includes(cat.id)) setOpen(true);
  }, [openIds, cat.id]);

  return (
    <li>
      <div className="d-flex align-items-center gap-1">
        {hasChildren && (
          <button
            type="button"
            className="btn btn-sm p-0 border-0 bg-transparent"
            aria-label={open ? 'Згорнути підкатегорії' : 'Розгорнути підкатегорії'}
            onClick={() => setOpen(o => !o)}
            style={{width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 2, color: '#7e57c2'}}
            tabIndex={0}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" style={{display: 'block', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s'}}>
              <polyline points="5,3 11,8 5,13" fill="none" stroke="#7e57c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <input
          type="radio"
          id={`cat-${cat.id}`}
          checked={isSelected}
          onChange={() => onSelect(cat.id)}
          name="category-tree"
          style={{ display: 'none' }}
        />
        <label
          htmlFor={`cat-${cat.id}`}
          className="ms-1"
          style={{cursor: 'pointer', fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#59359c' : undefined}}
        >
          {cat.name}
        </label>
      </div>
      {hasChildren && open && (
        <ul className="list-unstyled ms-3">
          {cat.children.map(child => (
            <CategoryNode key={child.id} cat={child} selected={selected} onSelect={onSelect} openIds={openIds} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default CategoryTree;
