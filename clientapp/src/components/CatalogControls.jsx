import React from 'react';
import { Form } from 'react-bootstrap';

const CatalogControls = ({
  sort,
  setSort,
  perPage,
  setPerPage,
  sortOptions
}) => {
  return (
    <div className="catalog-controls d-flex flex-wrap gap-3 align-items-center justify-content-between mb-3">
      <div className="d-flex gap-2 align-items-center w-100" style={{fontFamily: 'Montserrat'}}>
        <Form.Select
          size="sm"
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={{ minWidth: 220, fontFamily: 'Montserrat', color: '#6f42c1', borderRadius: 12, background: '#faf8fd', border: '1.5px solid #e5d1fa', fontWeight: 600, boxShadow: 'none' }}
          className="shadow-none"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Form.Select>
        <Form.Select
          size="sm"
          value={perPage}
          onChange={e => setPerPage(Number(e.target.value))}
          style={{ minWidth: 160, fontFamily: 'Montserrat', color: '#6f42c1', borderRadius: 12, background: '#faf8fd', border: '1.5px solid #e5d1fa', fontWeight: 600, boxShadow: 'none' }}
          className="shadow-none"
        >
          {[12, 24, 48].map(n => (
            <option key={n} value={n}>{n} / стор.</option>
          ))}
        </Form.Select>

      </div>
    </div>
  );
};

export default CatalogControls;
