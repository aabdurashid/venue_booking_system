import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function AddOwner() {
    const navigate = useNavigate()
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        phone_number: '',
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        const payload = {
            username: formData.username,
            password: formData.password,
            firstname: formData.firstname,
            lastname: formData.lastname,
            phone_number: formData.phone_number,
        }

        try {
            const token = localStorage.getItem('token')
            const res = await axios.post('http://localhost:3105/admin/addOwner', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(res.data);
            alert("To'yxona egasi muvaffaqiyatli yaratildi")
            navigate('/admin-dashboard/all-owners')
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Xatolik yuz berdi')
            } else {
                setError(error.message || 'Xatolik yuz berdi')
            }
        }
    }

    return (
        <section className="add-venue-section">
            <div className="container form-container">
                <div className="page-header">
                    <h1 className="page-title">To'yxona egasini qo'shish</h1>
                    <p className="page-subtitle">Yangi to'yxona egasining ma'lumotlarini kiriting</p>
                    <div className="breadcrumb">
                        <Link to='/admin-dashboard' className="breadcrumb-link">Admin Panel</Link>
                        <i className="fas fa-chevron-right"></i>
                        <span>Yangi egasi qo'shish</span>
                    </div>
                </div>

                <div className="form-card">
                    <h2 className="form-title"><i className="fa-solid fa-user"></i> To'yxona egasi ma'lumotlari</h2>

                    <form id="add-owner-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstname" className="form-label required">Ism</label>
                                <input
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    className="form-control"
                                    placeholder="Ismini kiriting"
                                    value={formData.firstname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastname" className="form-label required">Familiya</label>
                                <input
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    className="form-control"
                                    placeholder="Familiyasini kiriting"
                                    value={formData.lastname}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="username" className="form-label required">Foydalanuvchi Nomi</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    className="form-control"
                                    placeholder="Foydalanuvchi Nomini kiriting"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password" className="form-label required">Parol</label>
                                <input
                                    type="text"
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Parolini kiriting"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone-number" className="form-label required">Telefon raqami</label>
                            <div className="input-group">
                                <span className="input-group-text"><i className="fas fa-phone"></i></span>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone-number"
                                    name="phone_number"
                                    placeholder="+998901234567"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                    required />
                            </div>
                            <div className="form-text">Telefon raqamini to'liq formatda kiriting</div>
                        </div>

                        <div className="form-actions">
                            <Link to='/admin-dashboard' className="btn btn-danger btn-lg" >
                                <i className="fas fa-times"></i> Bekor qilish
                            </Link>
                            <button type="submit" className="btn btn-success btn-lg">
                                <i className="fas fa-plus-circle"></i> To'yxona qo'shish
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default AddOwner