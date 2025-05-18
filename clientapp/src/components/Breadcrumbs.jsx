import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => (
  <nav aria-label="breadcrumb" className="mb-3">
    <ol className="breadcrumb bg-transparent p-0">
      {items.map((item, idx) => (
        <li
          key={item.to || item.label}
          className={`breadcrumb-item${idx === items.length - 1 ? ' active' : ''}`}
          aria-current={idx === items.length - 1 ? 'page' : undefined}
        >
          {item.to && idx !== items.length - 1 ? (
            <Link
              to={item.to}
              style={item.label === 'Головна' ? { color: 'var(--purple)', fontWeight: 700 } : {}}
              aria-label={item.label}
            >
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumbs;
