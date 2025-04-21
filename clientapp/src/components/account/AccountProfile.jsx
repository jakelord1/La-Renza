import React from 'react';

const AccountProfile = () => {
  return (
    <div className="account-content">
      <h2 className="mb-4">Інформація профілю</h2>
      <div className="card">
        <div className="card-body">
          <form>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">Ім'я</label>
                <input type="text" className="form-control" id="firstName" />
              </div>
              <div className="col-md-6">
                <label htmlFor="lastName" className="form-label">Прізвище</label>
                <input type="text" className="form-control" id="lastName" />
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Електронна пошта</label>
              <input type="email" className="form-control" id="email" />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Телефон</label>
              <input type="tel" className="form-control" id="phone" />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="birthdate" className="form-label">Дата народження</label>
                <input type="date" className="form-control" id="birthdate" />
              </div>
              <div className="col-md-6">
                <label className="form-label d-block">Стать</label>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="gender-male" value="male" />
                  <label className="form-check-label" htmlFor="gender-male">Чоловіча</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="gender-female" value="female" />
                  <label className="form-check-label" htmlFor="gender-female">Жіноча</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="gender-other" value="other" />
                  <label className="form-check-label" htmlFor="gender-other">Інше</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-purple">Зберегти зміни</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile; 