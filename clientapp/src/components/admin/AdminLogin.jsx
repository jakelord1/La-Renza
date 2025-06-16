import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === 'admin@larenza.com' && password === 'admin123') {
  setLoading(true);
      navigate('/admin/dashboard');
    } else {
      setError('Невірний email або пароль');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-sm rounded-3">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2>Панель адміністратора</h2>
                <p className="text-muted">Увійдіть для доступу до адмін-панелі</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Введіть email"
                    className="rounded-3"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Введіть пароль"
                    className="rounded-3"
                  />
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 fw-bold py-2"
                  style={{ 
                    background: '#a259e6', 
                    borderColor: '#a259e6',
                    borderRadius: '12px',
                    height: '48px' 
                  }}
                >
                  Увійти
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
