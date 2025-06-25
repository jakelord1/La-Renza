import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';


const API_URL = 'https://localhost:7071/api/Users';


const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        birthDate: '',
        gender: false,
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        newsletter: false
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });



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

        if (!formData.firstName) {
            newErrors.firstName = 'Имя обязательно';
        }

        if (!formData.lastName) {
            newErrors.lastName = 'Фамилия обязательна';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = 'Необходимо принять условия использования';
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
            const body = {
                email: formData.email,
                fullName: formData.firstName + ' ' + formData.lastName,
                surName: formData.lastName,
                phoneNumber: formData.phoneNumber,
                birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
                gender: formData.gender,
                password: formData.password,
                newsOn: formData.newsletter
            };
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error('Не вдалося зареєструвати користувача');
            setAlert({ show: true, type: 'success', message: 'Користувача зареєстровано!' });
            setFormData({
                email: '',
                firstName: '',
                lastName: '',
                phoneNumber: '',
                birthDate: '',
                gender: false,
                password: '',
                confirmPassword: '',
                acceptTerms: false,
                newsletter: false
            });
            setErrors({});
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
                        <div className="col-md-8 col-lg-6">
                            <div className="bg-white rounded-4 p-5 shadow-sm">
                                <h1 className="text-center mb-4 text-purple">Реєстрація</h1>
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="firstName" className="form-label">Имя</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="lastName" className="form-label">Фамилия</label>
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="password" className="form-label">Пароль</label>
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
                                            <input
                                                type="password"
                                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phoneNumber" className="form-label">Телефон</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="birthDate" className="form-label">Дата рождения</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="birthDate"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label d-block">Пол</label>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="genderMale"
                                                value={true}
                                                checked={formData.gender === true}
                                                onChange={() => setFormData(prev => ({ ...prev, gender: true }))}
                                            />
                                            <label className="form-check-label" htmlFor="genderMale">Мужской</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="gender"
                                                id="genderFemale"
                                                value={false}
                                                checked={formData.gender === false}
                                                onChange={() => setFormData(prev => ({ ...prev, gender: false }))}
                                            />
                                            <label className="form-check-label" htmlFor="genderFemale">Женский</label>
                                        </div>
                                    </div>


                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className={`form-check-input ${errors.acceptTerms ? 'is-invalid' : ''}`}
                                                id="acceptTerms"
                                                name="acceptTerms"
                                                checked={formData.acceptTerms}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label className="form-check-label" htmlFor="acceptTerms">
                                                Я принимаю условия использования
                                            </label>
                                            {errors.acceptTerms && <div className="invalid-feedback">{errors.acceptTerms}</div>}
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id="newsletter"
                                                name="newsletter"
                                                checked={formData.newsletter}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="newsletter">
                                                Подписаться на рассылку
                                            </label>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-purple w-100 mb-3 text-white">
                                        Зареєструватися
                                    </button>

                                    <div className="text-center">
                                        <p className="mb-0">
                                            Вже є акаунт? <Link to="/login" className="text-purple">Увійти</Link>
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

export default RegisterForm; 