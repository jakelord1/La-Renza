import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import Alert from 'react-bootstrap/Alert';


const API_URL = 'https://localhost:7071/api/Account';

const AccountProfile = () => {
   const [formData, setFormData] = useState({
    firstName: '',
    surName : '',
    email: '',
    phoneNumber: '',
    birthDate: '',
    gender: '',
    });

const [alert, setAlert] = useState({ show: false, type: '', message: '' });
const [loading, setLoading] = useState(true);

 useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/accountProfile`, {
          method: 'GET',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Не удалось получить информацию о пользователе');
        }
        const data = await res.json();

        setFormData({
        firstName: data.fullName ? data.fullName.split(' ')[0] || '' : '',
        surName: data.surName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          birthDate: data.birthDate ? data.birthDate.substring(0, 10) : '',
          gender: data.gender === true ? 'male' : data.gender === false ? 'female' : 'other',
        });
      } catch (error) {
        setAlert({ show: true, type: 'danger', message: error.message });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);
    
  
   
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
         [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
  e.preventDefault();
  let genderBool = null;
  if (formData.gender === 'male') genderBool = true;
  else if (formData.gender === 'female') genderBool = false;
  else genderBool = null;
  const submitData = {
    ...formData,
    gender: genderBool,
  };
  try {
    const res = await fetch(`${API_URL}/changeAccountProfile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(submitData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Не вдалося змінити профіль');
    }

    setAlert({ show: true, type: 'success', message: 'Успішні зміни!' });
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
    <div className="account-content">
      <h2 className="mb-4">Інформація профілю</h2>
      <div className="card">
        <div className="card-body">
        <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="firstName" className="form-label">Ім'я</label>
                <input type="text" className="form-control" id="firstName"  
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange} />
              </div>
              <div className="col-md-6">
                <label htmlFor="surName" className="form-label">Прізвище</label>
                <input type="text" className="form-control" id="surName" 
                 name="surName"
                  value={formData.surName}
                  onChange={handleChange}/>
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Електронна пошта</label>
              <input type="email" className="form-control" id="email"
                name="email"
                value={formData.email}
                onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Телефон</label>
              <input type="tel" className="form-control" id="phone"
              name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange} />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="birthdate" className="form-label">Дата народження</label>
                <input type="date" className="form-control" id="birthdate" 
                   name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}/>
              </div>
              <div className="col-md-6">
                <label className="form-label d-block">Стать</label>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="gender-male" value="male" 
                   checked={formData.gender === 'male'}
                    onChange={handleChange}/>
                  <label className="form-check-label" htmlFor="gender-male">Чоловіча</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="gender-female" value="female" 
                  checked={formData.gender === 'female'}
                    onChange={handleChange}/>
                  <label className="form-check-label" htmlFor="gender-female">Жіноча</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="radio" name="gender" id="gender-other" value="other" 
                    checked={formData.gender === 'other'}
                    onChange={handleChange}/>
                  <label className="form-check-label" htmlFor="gender-other">Інше</label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn-purple">Зберегти зміни</button>
          </form>
        </div>
      </div>
    </div>
     </>
  );
};

export default AccountProfile; 
