import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/authStore';

function MainFunc() {
    const navigate = useNavigate()
    const logout = useAuthStore(state => state.logout)

    const handleLogout = () => {
        logout()
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        navigate('/')
    }

    return (
        <div>
            <div className="dashboard-header">
                <div className="dashboard-title-row">
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <div>
                        <div className="admin-badge">
                            <i className="fas fa-user-shield"></i>
                            <span>Admin</span>
                        </div>
                        <button className='btn btn-primary' onClick={handleLogout}>Logout <i className="fa-solid fa-right-to-bracket"></i></button>
                    </div>
                </div>
                <p className="dashboard-subtitle">To'yxonalarni boshqarish va nazorat qilish paneli</p>
            </div>

            <div className="action-buttons">
                <h2 className="action-buttons-title">Asosiy amallar</h2>
                <div className="buttons-grid">
                    <Link to='/admin-dashboard/add-venue' className="action-btn btn-success">
                        <i className="fas fa-plus-circle"></i>
                        <span>Yangi to'yxona qo'shish</span>
                    </Link>
                    <Link to='/admin-dashboard/add-owner' className="action-btn btn-primary">
                        <i className="fas fa-user-plus"></i>
                        <span>To'yxona egasini qo'shish</span>
                    </Link>
                    <Link to='/admin-dashboard/all-owners' className="action-btn btn-info">
                        <i className="fas fa-users"></i>
                        <span>To'yxona egalari</span>
                    </Link>
                    <Link to='/admin-dashboard/all-bookings' className="action-btn btn-warning">
                        <i className="fas fa-calendar-check"></i>
                        <span>Barcha bronlarni ko'rish</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MainFunc