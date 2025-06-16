import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';

const API_URL = 'https://localhost:7071/api/Account';


const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  console.log('Submitting login:', { email, password ,rememberMe});

  try {
    const res = await fetch(`${API_URL}/loginAdmin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, rememberMe})
    });

    console.log('Response status:', res.status);

    if (!res.ok) {
      const errorData = await res.json();
      console.log('Error data:', errorData);
      throw new Error(errorData.message || 'Невдалий вхід');
    }
     localStorage.setItem('adminAuthenticated', 'true');
    navigate('/admin/dashboard');
  } catch (err) {
    console.error('Login error:', err);
    setError(err.message);
  } finally {
    setLoading(false);
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
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Введіть email"
                    className="rounded-3"
                    disabled={loading}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Пароль</Form.Label>
                  <Form.Control
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Введіть пароль"
                    className="rounded-3"
                    disabled={loading}
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
                    disabled={loading}
                >
                  {loading ? 'Вхід...' : 'Увійти'}
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
