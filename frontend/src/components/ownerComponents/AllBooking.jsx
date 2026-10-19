import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function AllBooking() {
    const [bookings, setBookings] = useState([])
    const token = localStorage.getItem('token')

    useEffect(() => {
        axios
            .get('http://localhost:3105/owner/allBookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                setBookings(res.data)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    const deleteBooking = async (bookingId) => {
        try {
            const res = await axios.delete(`http://localhost:3105/owner/bookings/${bookingId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log('booking bekor qilindi', res.data);
            setBookings(prevBookings => prevBookings.filter(booking => booking.id !== bookingId))
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <section className="add-venue-section">
            <div className="container form-container">
                <div className="page-header">
                    <h1 className="page-title">Barcha bronlar</h1>
                    <p className="page-subtitle">Barcha to'yxona bronlarini boshqarish va nazorat qilish</p>
                    <div className="breadcrumb">
                        <Link to='/owner-dashboard'>Owner Panel</Link>
                        <i className="fas fa-chevron-right"></i>
                        <span>Barcha bronlar</span>
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
                                    <th>To'yxona nomi</th>
                                    <th>Manzil</th>
                                    <th>Tuman</th>
                                    <th>Sana</th>
                                    <th>Telefon raqami</th>
                                    <th>Status</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => {
                                    const bookingDate = new Date(booking.booking_date);
                                    const todayStart = new Date();
                                    todayStart.setHours(0, 0, 0, 0);
                                    
                                    return (
                                        <tr key={booking.id}>
                                            <td>{index + 1}</td>
                                            <td>{booking.firstname}</td>
                                            <td>{booking.lastname}</td>
                                            <td>{booking.venue_name}</td>
                                            <td>{booking.address}</td>
                                            <td>{booking.district}</td>
                                            <td>{bookingDate.toLocaleDateString('en-CA')}</td>
                                            <td>{booking.phone_number}</td>
                                            <td className={bookingDate >= todayStart ? 'active-status' : 'inactive-status'}>{bookingDate >= todayStart ? "Endi bo'ladigan" : "O'tib ketgan"}</td>
                                            <td><button onClick={() => deleteBooking(booking.id)} className='btn btn-danger'><i className="fa-solid fa-trash"></i></button></td>
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

export default AllBooking