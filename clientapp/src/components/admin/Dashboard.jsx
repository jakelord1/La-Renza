import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Badge, Spinner, Alert } from 'react-bootstrap';

const PRODUCTS_API = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Products`;
const ORDERS_API = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Orders`;
const USERS_API = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Users`;
const COUPONS_API = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Coupons`;
const COMMENTS_API = `${import.meta.env.VITE_BACKEND_API_LINK}/api/Comments`;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [productsRes, ordersRes, usersRes, couponsRes, commentsRes] = await Promise.all([
          fetch(PRODUCTS_API),
          fetch(ORDERS_API),
          fetch(USERS_API),
          fetch(COUPONS_API),
          fetch(COMMENTS_API)
        ]);
        if (!productsRes.ok) throw new Error('Помилка завантаження товарів');
        if (!ordersRes.ok) throw new Error('Помилка завантаження замовлень');
        if (!usersRes.ok) throw new Error('Помилка завантаження користувачів');
        if (!couponsRes.ok) throw new Error('Помилка завантаження купонів');
        if (!commentsRes.ok) throw new Error('Помилка завантаження коментарів');
        const [productsData, ordersData, usersData, couponsData, commentsData] = await Promise.all([
          productsRes.json(),
          ordersRes.json(),
          usersRes.json(),
          couponsRes.json(),
          commentsRes.json()
        ]);
        setProducts(productsData);
        setOrders(ordersData);
        setUsers(usersData);
        setCoupons(couponsData);
        setComments(commentsData);
      } catch (e) {
        setAlert({ show: true, type: 'danger', message: e.message });
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalUsers = users.length;
  // Количество активных купонов 
  const activeCoupons = coupons.length;
  // Общее количество комментариев
  const totalComments = comments.length;
  // Самый популярный способ оплаты
  let popularPayment = '';
  if (orders.length > 0) {
    const paymentCount = {};
    orders.forEach(order => {
      if (!order.paymentMethod) return;
      paymentCount[order.paymentMethod] = (paymentCount[order.paymentMethod] || 0) + 1;
    });
    popularPayment = Object.keys(paymentCount).sort((a, b) => paymentCount[b] - paymentCount[a])[0] || '';
  }

  return (
    <div>
      <h2 className="mb-4 fw-bold">Огляд</h2>
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>{alert.message}</Alert>
      )}
      {loading ? (
        <div className="text-center py-5"><Spinner animation="border" style={{ color: '#6f42c1' }} /></div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={3} sm={6} xs={12}>
              <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
                <Card.Body>
                  <div className="mb-2">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                      <i className="bi bi-grid fs-2" style={{color: '#6f42c1'}}></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{totalProducts}</h3>
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
                  <h3 className="fw-bold mb-0">{totalOrders}</h3>
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
                  <h3 className="fw-bold mb-0">{totalUsers}</h3>
                  <div className="text-muted small">Користувачі</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6} xs={12}>
              <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
                <Card.Body>
                  <div className="mb-2">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                      <i className="bi bi-ticket-perforated fs-2 text-warning"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{activeCoupons}</h3>
                  <div className="text-muted small">Активних купонів</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="g-4 mb-4">
            <Col md={4} sm={12}>
              <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
                <Card.Body>
                  <div className="mb-2">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                      <i className="bi bi-chat-left-text fs-2 text-secondary"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{totalComments}</h3>
                  <div className="text-muted small">Всього коментарів</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} sm={12}>
              <Card className="shadow rounded-4 border-0 bg-white bg-opacity-75 text-center p-3">
                <Card.Body>
                  <div className="mb-2">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light shadow-sm" style={{ width: 56, height: 56 }}>
                      <i className="bi bi-credit-card fs-2 text-success"></i>
                    </span>
                  </div>
                  <h3 className="fw-bold mb-0">{popularPayment || '—'}</h3>
                  <div className="text-muted small">Найпопулярніший спосіб оплати</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default Dashboard; 