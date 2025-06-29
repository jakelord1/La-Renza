import React, { useEffect } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { Container, Row, Col, Nav } from 'react-bootstrap';

const navLinks = [
  {
    to: '/admin/dashboard',
    icon: 'bi-speedometer2',
    label: 'Дашборд',
  },
  {
    to: '/admin/configurator',
    icon: 'bi-tools',
    label: 'Конфігуратор',
  },
  {
    to: '/admin/orders',
    icon: 'bi-cart-check',
    label: 'Замовлення',
  },
  {
    to: '/admin/invoices',
    icon: 'bi-receipt',
    label: 'Інвойси',
  },
  {
    to: '/admin/comments',
    icon: 'bi-chat-left-text',
    label: 'Коментарі',
  },
  {
    to: '/admin/coupons',
    icon: 'bi-ticket-perforated',
    label: 'Купони',
  },
  {
    to: '/admin/users',
    icon: 'bi-people',
    label: 'Користувачі'
  },
  {
    to: '/admin/categories',
    icon: 'bi-folder2-open',
    label: 'Категорії',
  },
  {
    to: '/admin/sizes',
    icon: 'bi-arrows-angle-expand',
    label: 'Розміри',
  },
  {
    to: '/admin/delivery-methods',
    icon: 'bi-truck',
    label: 'Доставка',
  },
  {
    to: '/admin/addresses',
    icon: 'bi-geo-alt',
    label: 'Адреси',
  },
  {
    to: '/admin/images',
    icon: 'bi-image',
    label: 'Фото',
  },
  {
    to: '/admin/administrators',
    icon: 'bi-shield-lock',
    label: 'Адміністратори'
  },
  {
    to: '/admin/colors',
    icon: 'bi-palette',
    label: 'Кольори'
  },
  {
    to: '/admin/products',
    icon: 'bi-box-seam',
    label: 'Товари'
  },
  {
    to: '/admin/models',
    icon: 'bi-diagram-3',
    label: 'Моделі'
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [navigate]);

const handleLogout = async () => {
  try {
    const response = await fetch('https://localhost:7071/api/Account/logoutAdmin', {
      method: 'GET',
      credentials: 'include', 
    });

    if (!response.ok) {
      console.error('Logout failed');
      return;
    }
    localStorage.removeItem('adminAuthenticated');
    navigate('/admin'); 
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

  return (
    <Container fluid className="p-0 bg-light min-vh-100 admin-bg">
      <Row className="g-0 min-vh-100">
        <Col
          md={3}
          className="d-flex align-items-start justify-content-center"
          style={{ minWidth: 220, maxWidth: 320, padding: '32px 0', background: 'transparent' }}
        >
          <div
            className="admin-sidebar-card shadow-sm bg-white bg-opacity-100 d-flex flex-column justify-content-between align-items-stretch"
            style={{ borderRadius: 24, minHeight: '70vh', width: '100%', maxWidth: 260, padding: '24px 0 16px 0', boxShadow: '0 4px 32px rgba(162,89,230,0.07)', border: 'none', position: 'sticky', top: 32, display: 'flex', flexDirection: 'column' }}
          >
            <div>
              <div className="d-flex flex-column align-items-center mb-2">
                <img src="/images/larenza-logo.png" alt="La'Renza Logo" style={{ height: 18, width: 'auto', marginBottom: 0, objectFit: 'contain', display: 'block' }} />
              </div>
            </div>
            <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
              <div className="admin-sidebar-scroll" style={{width: '100%'}}>
                <Nav className="flex-column gap-2 w-100 align-items-center px-2 mt-4">
                  {navLinks.map(link => (
                    <Nav.Item key={link.to} className="w-100">
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `nav-link d-flex align-items-center gap-3 px-4 py-2 w-100 sidebar-nav-link${isActive ? ' active' : ''}`
                        }
                        style={{ 
                          fontSize: '1.08rem', 
                          borderRadius: 10, 
                          justifyContent: 'flex-start', 
                          fontWeight: 600, 
                          transition: 'background 0.18s, color 0.18s',
                          minHeight: 'calc(1.08rem + 16px)'
                        }}
                      >
                        <i className={`bi ${link.icon}`} style={{ fontSize: '1.2rem' }}></i>
                        <span className="d-none d-md-inline" style={{ fontWeight: 600 }}>{link.label}</span>
                      </NavLink>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
            </div>
            <div className="px-4" style={{marginTop: '4px'}}>
              <button
                className="sidebar-nav-link w-100 d-flex align-items-center gap-3 px-4 py-2 justify-content-start"
                title="Вихід"
                onClick={handleLogout}
                style={{ 
                  fontSize: '1.05rem', 
                  borderRadius: 10, 
                  fontWeight: 600, 
                  background: 'var(--purple)', 
                  color: '#fff', 
                  border: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 8,
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#5a32a3';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple)';
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                <span className="d-none d-md-inline">Вихід</span>
              </button>
            </div>
          </div>
        </Col>

        <Col md={9} className="p-4">
          <div className="container-fluid px-0">
            <Outlet />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout; 