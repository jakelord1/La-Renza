import React from 'react';
import { Form, Button, Collapse } from 'react-bootstrap';

const CatalogSidebar = ({
  filters,
  setFilters,
  categories,
  sizes,
  colors,
  brands,
  onReset
}) => {
  return (
    <aside className="catalog-sidebar pe-2" style={{minWidth: 240, maxWidth: 320}}>
      <h5 className="fw-bold mb-3">Фільтри</h5>
      {/* Категорії */}
      <div className="mb-4">
        <div className="fw-semibold mb-2">Категорії</div>
        <ul className="list-unstyled mb-0">
          {categories.map(cat => (
            <li key={cat.value}>
              <Form.Check
                type="checkbox"
                id={`cat-${cat.value}`}
                label={cat.label}
                checked={filters.categories.includes(cat.value)}
                onChange={e => {
                  setFilters(f => ({
                    ...f,
                    categories: e.target.checked
                      ? [...f.categories, cat.value]
                      : f.categories.filter(v => v !== cat.value)
                  }));
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      {/* Ціна */}
      <div className="mb-4">
        <div className="fw-semibold mb-2">Ціна</div>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            size="sm"
            type="number"
            placeholder="Від"
            value={filters.priceMin}
            onChange={e => setFilters(f => ({ ...f, priceMin: e.target.value }))}
            style={{width: 70}}
          />
          <span>-</span>
          <Form.Control
            size="sm"
            type="number"
            placeholder="До"
            value={filters.priceMax}
            onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))}
            style={{width: 70}}
          />
        </div>
      </div>
      {/* Кольори */}
      <div className="mb-4">
        <div className="fw-semibold mb-2">Колір</div>
        <div className="d-flex flex-wrap gap-2">
          {colors.map(color => (
            <div
              key={color.value}
              title={color.label}
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                background: color.hex,
                border: filters.colors.includes(color.value) ? '2px solid var(--purple)' : '2px solid #eee',
                cursor: 'pointer',
                outline: 'none',
                boxShadow: filters.colors.includes(color.value) ? '0 0 0 2px #e5d1fa' : 'none'
              }}
              onClick={() => setFilters(f => ({
                ...f,
                colors: f.colors.includes(color.value)
                  ? f.colors.filter(v => v !== color.value)
                  : [...f.colors, color.value]
              }))}
              tabIndex={0}
              role="button"
            />
          ))}
        </div>
      </div>
      {/* Розміри */}
      <div className="mb-4">
        <div className="fw-semibold mb-2">Розмір</div>
        <div className="d-flex flex-wrap gap-2">
          {sizes.map(size => (
            <Form.Check
              key={size.value}
              type="checkbox"
              id={`size-${size.value}`}
              label={size.label}
              checked={filters.sizes.includes(size.value)}
              onChange={e => {
                setFilters(f => ({
                  ...f,
                  sizes: e.target.checked
                    ? [...f.sizes, size.value]
                    : f.sizes.filter(v => v !== size.value)
                }));
              }}
            />
          ))}
        </div>
      </div>
      {/* Бренди */}
      <div className="mb-4">
        <div className="fw-semibold mb-2">Бренд</div>
        <ul className="list-unstyled mb-0">
          {brands.map(brand => (
            <li key={brand.value}>
              <Form.Check
                type="checkbox"
                id={`brand-${brand.value}`}
                label={brand.label}
                checked={filters.brands.includes(brand.value)}
                onChange={e => {
                  setFilters(f => ({
                    ...f,
                    brands: e.target.checked
                      ? [...f.brands, brand.value]
                      : f.brands.filter(v => v !== brand.value)
                  }));
                }}
              />
            </li>
          ))}
        </ul>
      </div>
      <Button variant="outline-secondary" size="sm" className="w-100 mt-2" onClick={onReset}>
        Скинути фільтри
      </Button>
    </aside>
  );
};

export default CatalogSidebar;
