import React, { useState } from 'react';

import Alert from 'react-bootstrap/Alert';

const API_URL = 'https://localhost:7071/api/Users';

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert({ show: false, type: '', message: '' });

    if (newPassword !== confirmPassword) {
      setAlert({ show: true, type: 'danger', message: 'Новий пароль та підтвердження не співпадають.' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/changeUserPassword`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setAlert({ show: true, type: 'danger', message: errorData.message || 'Сталася помилка при зміні пароля.' });
        return;
      }

      const data = await response.json();
      setAlert({ show: true, type: 'success', message: data.message || 'Пароль успішно змінено.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setAlert({ show: true, type: 'danger', message: 'Не вдалося підключитися до сервера.' });
    }
  };

  const handleDeleteAccount = async () => {
  if (!window.confirm("Ви дійсно хочете видалити свій акаунт? Ця дія необоротна.")) {
    return;
  }
  try {
    const response = await fetch(`${API_URL}/deleteAccount`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      setAlert({ show: true, type: 'danger', message: errorData.message || 'Не вдалося видалити акаунт.' });
      return;
    }

    const data = await response.json();
    setAlert({ show: true, type: 'success', message: data.message || 'Акаунт успішно видалено.' });

    setTimeout(() => {
      window.location.href = '/';
    }, 2000);

  } catch (err) {
    setAlert({ show: true, type: 'danger', message: 'Не вдалося підключитися до сервера.' });
  }
};


  return (
    <div className="account-content">
      <h2 className="mb-4">Налаштування акаунта</h2>
      
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Сповіщення на електронну пошту</h5>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="orderUpdates" defaultChecked />
              <label className="form-check-label" htmlFor="orderUpdates">
                Оновлення замовлень та сповіщення про доставку
              </label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="promotions" defaultChecked />
              <label className="form-check-label" htmlFor="promotions">
                Акції та спеціальні пропозиції
              </label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="newsletter" />
              <label className="form-check-label" htmlFor="newsletter">
                Щотижнева розсилка
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Змінити пароль</h5>
          
          {alert.show && (
            <Alert
              variant={alert.type}
              onClose={() => setAlert({ ...alert, show: false })}
              dismissible
              className="mb-3"
            >
              {alert.message}
            </Alert>
          )}
            <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Поточний пароль</label>
             <input
                type="password"
                className="form-control"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
             </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">Новий пароль</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              /> 
              </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Підтвердіть новий пароль</label>
             <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
                 </div>
            <button type="submit" className="btn btn-purple">Оновити пароль</button>
          </form>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-4">Налаштування конфіденційності</h5>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="profileVisibility" defaultChecked />
              <label className="form-check-label" htmlFor="profileVisibility">
                Зробити мій профіль видимим для інших користувачів
              </label>
            </div>
          </div>
          <div className="mb-3">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="activityTracking" defaultChecked />
              <label className="form-check-label" htmlFor="activityTracking">
                Дозволити відстеження активності для персоналізованих рекомендацій
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-danger">
        <div className="card-body">
          <h5 className="card-title text-danger">Видалити обліковий запис</h5>
          <p className="card-text">Якщо ви видалите обліковий запис, повернення буде неможливим. Будь ласка, переконайтесь, що ви дійсно цього хочете.</p>
          <button className="btn btn-outline-danger"  onClick={handleDeleteAccount}>
            <i className="bi bi-exclamation-triangle me-2"></i>Видалити обліковий запис
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 