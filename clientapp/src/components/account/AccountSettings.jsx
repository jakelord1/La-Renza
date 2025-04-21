import React from 'react';

const AccountSettings = () => {
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
          <form>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Поточний пароль</label>
              <input type="password" className="form-control" id="currentPassword" />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">Новий пароль</label>
              <input type="password" className="form-control" id="newPassword" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Підтвердіть новий пароль</label>
              <input type="password" className="form-control" id="confirmPassword" />
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
          <button className="btn btn-outline-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>Видалити обліковий запис
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings; 