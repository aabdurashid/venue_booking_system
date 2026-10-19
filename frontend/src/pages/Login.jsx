import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../zustand/authStore';

function Login() {
    const navigate = useNavigate()
    const {role, username, password, error, token, setRole, setUsername, setPassword, setError, setToken } = useAuthStore()

    const handleRoleChange = (e) => {
        setRole(e.target.value);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const loginData = { username, password };

        try {
            let response;
            if (role === 'admin') {
                response = await axios.post('http://localhost:3105/admin/login', loginData);
            } else if (role === 'owner') {
                response = await axios.post('http://localhost:3105/owner/login', loginData);
            }

            if (response.data.token) {
                setToken(response.data.token)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', role);

                if (role === 'admin') {
                    navigate('/admin-dashboard')
                } else if (role === 'owner') {
                    localStorage.setItem('owner', JSON.stringify(response.data.owner))
                    navigate('/owner-dashboard')
                }
            }
            console.log('Login muvaffaqiyatli:', response.data);

        } catch (error) {
            console.error('Login xatosi:', error.response?.data || error.message);
            if (error.response && error.response.data && error.response.data.message) {
                setError("Loginda xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
            }
        }
    };

    return (
        <section className="login-section">
            <div className="container login-container">
                <h1 className="section-title">Tizimga kirish</h1>
                <p className="section-subtitle">Profilingizga kirish uchun ma'lumotlaringizni kiriting</p>

                <div className="login-card">
                    <div className="role-selector">
                        <h3 className="role-title">Rolni tanlang</h3>
                        <div className="role-options">
                            <div className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    id="admin-role"
                                    className="role-input"
                                    value="admin"
                                    checked={role === 'admin'}
                                    onChange={handleRoleChange}
                                />
                                <label htmlFor="admin-role" className="role-label">
                                    <i className="fas fa-user-shield role-icon"></i>
                                    <span className="role-text">Admin</span>
                                </label>
                            </div>
                            <div className="role-option">
                                <input
                                    type="radio"
                                    name="role"
                                    id="owner-role"
                                    className="role-input"
                                    value="owner"
                                    checked={role === 'owner'}
                                    onChange={handleRoleChange}
                                />
                                <label htmlFor="owner-role" className="role-label">
                                    <i className="fa-solid fa-user-tie role-icon"></i>
                                    <span className="role-text">To'yxona egasi</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="form-divider">Kirish ma'lumotlari</div>

                    <form id="login-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="form-label">Foydalanuvchi Nomi:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Foydalanuvchi nomini kiriting"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">Parol:</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                placeholder="Parolingizni kiriting"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">Tizimga Kirish</button>
                        {error && (
                            <div className="error-message" style={{ color: 'red', margin: '10px', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}
                    </form>

                    <div className="form-divider">yoki</div>

                    <div className="social-login">
                        <button className="social-btn google">
                            <i className="fab fa-google"></i>
                            <span>Google orqali</span>
                        </button>
                        <button className="social-btn facebook">
                            <i className="fab fa-facebook-f"></i>
                            <span>Facebook orqali</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
