import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';

const Dashboard = () => {
  const stats = {
    totalProducts: 124,
    totalOrders: 56,
    totalUsers: 432,
    revenueMonth: 245600,
    pendingOrders: 12,
  };

  const actions = [
    {
      title: 'Нове замовлення #12345',
      desc: 'Статус змінено на "Доставлено"',
      time: '2 години тому',
      icon: 'bi-bag-check',
      color: 'primary',
    },
    {
      title: 'Новий товар',
      desc: 'Додано товар "Футболка класична"',
      time: '5 годин тому',
      icon: 'bi-plus-circle',
      color: 'success',
    },
    {
      title: 'Реєстрація',
      desc: 'Новий користувач зареєстрований',
      time: 'Вчора',
      icon: 'bi-person-plus',
      color: 'info',
    },
  ];

  return (
    <div>
      <h2 className="mb-4 fw-bold">Огляд</h2>
      <Row className="g-4 mb-4">
        <Col md={3} sm={6} xs={12}>
          <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
            <Card.Body>
              <div className="mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                  <i className="bi bi-grid fs-2 text-primary"></i>
                </span>
              </div>
              <h3 className="fw-bold mb-0">{stats.totalProducts}</h3>
              <div className="text-muted small">Товари</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
            <Card.Body>
              <div className="mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                  <i className="bi bi-bag fs-2 text-success"></i>
                </span>
              </div>
              <h3 className="fw-bold mb-0">{stats.totalOrders}</h3>
              <div className="text-muted small">Замовлення</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
            <Card.Body>
              <div className="mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                  <i className="bi bi-people fs-2 text-info"></i>
                </span>
              </div>
              <h3 className="fw-bold mb-0">{stats.totalUsers}</h3>
              <div className="text-muted small">Користувачі</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6} xs={12}>
          <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
            <Card.Body>
              <div className="mb-2">
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                  <i className="bi bi-currency-exchange fs-2 text-warning"></i>
                </span>
              </div>
              <h3 className="fw-bold mb-0">{stats.revenueMonth.toLocaleString()} ₴</h3>
              <div className="text-muted small">Виручка за місяць</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="g-4">
        <Col md={6}>
          <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Очікують обробки</Card.Title>
              <div className="d-flex align-items-center gap-3">
                <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 48, height: 48 }}>
                  <i className="bi bi-hourglass-split fs-3 text-secondary"></i>
                </span>
                <div>
                  <h4 className="fw-bold mb-0">{stats.pendingOrders}</h4>
                  <div className="text-muted small">Нових замовлень</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 h-100">
            <Card.Body>
              <Card.Title className="fw-bold mb-3">Останні дії</Card.Title>
              <ul className="list-unstyled mb-0">
                {actions.map((action, idx) => (
                  <li key={idx} className="d-flex align-items-center gap-3 mb-3 pb-2 border-bottom border-light-subtle last:border-0">
                    <span className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm text-${action.color}`} style={{ width: 40, height: 40 }}>
                      <i className={`bi ${action.icon} fs-5`}></i>
                    </span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{action.title}</div>
                      <div className="text-muted small">{action.desc}</div>
                    </div>
                    <span className="text-muted small">{action.time}</span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 