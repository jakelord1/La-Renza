import React from 'react';
import { Form, Button, Collapse } from 'react-bootstrap';
import CategoryTree from './CategoryTree';
import { useNavigate } from 'react-router-dom';

const CatalogSidebar = ({
  filters,
  setFilters,
  categories,
  sizes,
  colors,
  onReset
}) => {
  const navigate = useNavigate();
  return (
    <aside className="catalog-sidebar pe-2" style={{minWidth: 240, maxWidth: 320}}>
      <h5 className="fw-bold mb-3">Фільтри</h5>

      <div className="mb-4">
        <div className="fw-semibold mb-2">Категорії</div>
        <CategoryTree
          categories={categories}
          selected={filters.categories}
          onSelect={catId => navigate(`/catalog/category/${catId}`)}
        />
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm mt-2"
          style={{width: '100%'}}
          onClick={() => {
            navigate('/catalog');
            setFilters(f => ({ ...f, categories: [] }));
          }}
        >
          Скинути категорію
        </button>
      </div>

      <div className="mb-4">
        <div className="fw-semibold mb-2">Ціна</div>
        <div className="d-flex align-items-center gap-2">
          <Form.Control
            size="sm"
            type="text"
            placeholder="Від"
            value={filters.priceMin}
            onChange={e => setFilters(f => ({ ...f, priceMin: e.target.value }))}
            style={{width: 70}}
          />
          <span>-</span>
          <Form.Control
            size="sm"
            type="text"
            placeholder="До"
            value={filters.priceMax}
            onChange={e => setFilters(f => ({ ...f, priceMax: e.target.value }))}
            style={{width: 70}}
          />
        </div>
      </div>

      <div className="mb-4">
        <div className="fw-semibold mb-2">Колір</div>
        <div className="d-flex flex-wrap gap-2">
          {colors.map(color => {
            const selected = filters.colors.includes(color.value);
            return (
              <div
                key={color.value}
                title={color.label}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  border: selected ? '2px solid var(--purple)' : '2px solid #eee',
                  cursor: 'pointer',
                  outline: 'none',
                  boxShadow: selected ? '0 0 0 2px #e5d1fa' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onClick={() => setFilters(f => ({
                  ...f,
                  colors: f.colors.includes(color.value)
                    ? f.colors.filter(v => v !== color.value)
                    : [...f.colors, color.value]
                }))}
                tabIndex={0}
                role="button"
              >
                {color.imagePath ? (
                  <img
                    src={"/images/" + color.imagePath}
                    alt={color.label}
                    style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#eee', display: 'block' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

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

      <Button variant="outline-secondary" size="sm" className="w-100 mt-2" onClick={onReset}>
        Скинути фільтри
      </Button>


    </aside>
  );
};

export default CatalogSidebar;
