import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log('Login data:', formData);
  };

  return (
    <div style={{ backgroundColor: '#343a40', color: '#fff', minHeight: 'calc(100vh - 76px)', marginTop: '-1px' }}>
      <div className="container py-5">
        <h1 className="text-center mb-5">Вход</h1>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <form onSubmit={handleSubmit} className="bg-dark p-4 rounded">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Пароль</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <div className="form-check">
                  <input 
                    type="checkbox" 
                    className="form-check-input" 
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Запомнить меня
                  </label>
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Войти
              </button>
              
              <div className="text-center mb-3">
                <Link to="/forgot-password" className="text-primary">
                  Забыли пароль?
                </Link>
              </div>
              
              <div className="text-center mb-4">
                <p className="text-muted mb-3">Или войдите через</p>
                <div className="d-flex justify-content-center gap-3">
                  <button type="button" className="btn btn-outline-primary" disabled>
                    <i className="bi bi-facebook me-2"></i>Facebook
                  </button>
                  <button type="button" className="btn btn-outline-danger" disabled>
                    <i className="bi bi-google me-2"></i>Google
                  </button>
                </div>
              </div>
              
              <div className="text-center">
                <p className="mb-0">
                  Нет аккаунта? <Link to="/register" className="text-primary">Зарегистрироваться</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 