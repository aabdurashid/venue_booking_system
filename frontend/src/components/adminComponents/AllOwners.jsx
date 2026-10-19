import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import useAdminStore from '../../zustand/adminStore';

function AllOwners() {
    const { owners, loading, error, fetchOwners } = useAdminStore()
    const token = localStorage.getItem('token')

    useEffect(() => {
        fetchOwners()
    }, [fetchOwners])


    if (loading) return <h1>Yuklanmoqda...</h1>
    if (error) return <h1>{error}</h1>

    const deleteOwner = async (ownerId) => {
        try {
            const res = await axios.delete(`http://localhost:3105/admin/deleteOwner/${ownerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('owner ochirildi', res.data);
            fetchOwners()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="add-venue-section">
            <div className="container form-container">
                <div className="page-header">
                    <h1 className="page-title">To'yxona egalari</h1>
                    <p className="page-subtitle">Barcha to'yxona egalarini boshqarish va nazorat qilish</p>
                    <div className="breadcrumb">
                        <Link to='/admin-dashboard'>Admin Panel</Link>
                        <i className="fas fa-chevron-right"></i>
                        <span>To'yxona egalari</span>
                    </div>
                </div>

                <div className="owners-data-section">
                    <div className="table-scroll-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Ism</th>
                                    <th>Familiya</th>
                                    <th>Telefon raqami</th>
                                    <th>Foy. nomi</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {owners.map((owner, index) => {
                                    return (
                                        <tr key={owner.id}>
                                            <td>{index + 1}</td>
                                            <td>{owner.firstname}</td>
                                            <td>{owner.lastname}</td>
                                            <td>{owner.phone_number}</td>
                                            <td>{owner.username}</td>
                                            <td><button onClick={() => deleteOwner(owner.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AllOwners