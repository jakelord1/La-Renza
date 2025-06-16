import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Alert from 'react-bootstrap/Alert';


const API_URL = 'https://localhost:7071/api/Account/loginUser';


const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();


 
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Неверный формат email';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        setErrors(newErrors);
        console.log('Ошибки валидации:', newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
      console.log('handleSubmit вызван');
        if (!validateForm()) return;

      try {
          const res = await fetch(API_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
              body: JSON.stringify({
                  email: formData.email,
                  password: formData.password,
                  rememberMe: formData.rememberMe
              })
          });
          if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.message || 'Не удалось войти');
          }

          setAlert({ show: true, type: 'success', message: 'Вход успешный!' });
          setFormData({
              email: '',
              password: '',
              rememberMe: false
          });

          navigate('/'); 
      } catch (e) {
          setAlert({ show: true, type: 'danger', message: e.message });
      }
  };

    return (
        <>
            {alert.show && (
                <Alert variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}
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
        </>
  );
};

export default LoginForm; 