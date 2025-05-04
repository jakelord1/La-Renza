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
    <section className="auth-page bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="bg-white rounded-4 p-5 shadow-sm">
              <h1 className="text-center mb-4 text-purple">Вхід</h1>
              <form onSubmit={handleSubmit}>
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
                
                <button type="submit" className="btn btn-purple w-100 mb-3">
                  Войти
                </button>
                
                <div className="text-center mb-3">
                  <Link to="/forgot-password" className="text-purple">
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
                    Нет аккаунта? <Link to="/register" className="text-purple">Зарегистрироваться</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginForm; 