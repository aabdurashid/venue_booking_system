import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';

function VenuesDetails() {
    const { id } = useParams()
    const [venue, setVenue] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [mainImage, setMainImage] = useState(null)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [bookedDates, setBookedDates] = useState([]);

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const token = localStorage.getItem('token')
                const venueRes = await axios.get(`http://localhost:3105/owner/venues/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setVenue(venueRes.data)
                if (venueRes.data.images && venueRes.data.images?.length > 0) {
                    setMainImage(venueRes.data.images[0])
                }

                const bookingsRes = await axios.get(`http://localhost:3105/admin/venues/${id}/bookings`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const bookingsWithDates = bookingsRes.data.map(booking => ({
                    ...booking,
                    booking_date: new Date(booking.booking_date)
                }))
                setBookedDates(bookingsWithDates)
            } catch (err) {
                setError('To\'yxona ma\'lumotlarini olishda xatolik yuz berdi')
            } finally {
                setLoading(false)
            }
        }
        fetchVenue()
    }, [id])

    if (loading) return <h2>Yuklanmoqda...</h2>
    if (error) return <h2 style={{ color: 'red' }}>{error}</h2>
    if (!venue) return <h2>To'yxona topilmadi</h2>

    return (
        <div className='dashboard-section'>
            <div className='container'>
                <div className="dashboard-header">
                    <div className="dashboard-title-row">
                        <h1 className="dashboard-title">{venue?.name} To'yxonasi</h1>
                        <div className="admin-badge" style={{ backgroundColor: '#d4edda', color: '#155724' }}>
                            <i className="fas fa-check-circle"></i> Faol
                        </div>
                    </div>
                    <p className="dashboard-subtitle">{venue?.district}da joylashgan zamonaviy to'yxona, {venue?.capacity} kishigacha sig'imi bilan</p>
                    <div className="action-buttons-row">
                        <Link to={`/venues/${venue?.id}/edit`} state={{ venue }} className="btn btn-warning">
                            <i className="fas fa-edit"></i> Tahrirlash
                        </Link>
                        <Link to='/owner-dashboard' className="btn btn-danger">
                            <i className="fas fa-arrow-left"></i> Orqaga
                        </Link>
                    </div>
                </div>

                <div className="venue-layout">
                    <div className="top-section">
                        <div className="gallery-section">
                            <h2 className="section_title">
                                <i className="fas fa-images"></i> Rasmlar galereyasi
                            </h2>
                            <div className="main-image-container">
                                <img
                                    src={`http://localhost:3105/uploads/${mainImage}`}
                                    alt="Grand Palace asosiy rasm"
                                    className="main-venue-image"
                                    id="main-image" />
                                <div className="image-overlay">
                                    <i className="fas fa-camera"></i>
                                </div>
                            </div>
                            <div className="gallery-grid">
                                {venue.images?.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`gallery-item ${mainImage === img ? 'active' : ''}`}
                                        onClick={() => setMainImage(img)}
                                    >
                                        <img
                                            src={`http://localhost:3105/uploads/${img}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="gallery-image"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="venue-info-section">
                            <h2 className="section_title">
                                <i className="fas fa-info-circle"></i> To'yxona ma'lumotlari
                            </h2>
                            <p className="venue-description">
                                {venue?.name} To'yxonasi - Toshkent shahrining {venue?.district}da joylashgan zamonaviy va
                                hashamatli to'yxona. Eng yuqori darajadagi xizmat va qulay sharoitlar bilan to'ylaringizni
                                unutilmas qiladi.
                            </p>
                            <div className="info-grid">
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-users"></i>
                                    </div>
                                    <div className="info-content">
                                        <div className="info-label">Sig'im</div>
                                        <div className="info-value">{venue?.capacity} kishi</div>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-map-marker-alt"></i>
                                    </div>
                                    <div className="info-content">
                                        <div className="info-label">Manzil</div>
                                        <div className="info-value">{venue?.district}, {venue?.address}</div>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-phone"></i>
                                    </div>
                                    <div className="info-content">
                                        <div className="info-label">Telefon</div>
                                        <div className="info-value">{venue?.phone_number}</div>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div className="info-content">
                                        <div className="info-label">Ish vaqti</div>
                                        <div className="info-value">9:00 - 23:00</div>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-car"></i>
                                    </div>
                                    <div className="info-content">
                                        <div className="info-label">Avtoturargoh</div>
                                        <div className="info-value">50 ta o'rin</div>
                                    </div>
                                </div>
                                <div className="info-item">
                                    <div className="info-icon">
                                        <i className="fas fa-money-bill-wave"></i>
                                    </div>
                                    <div className="info-content">
                                        <div className="info-label">Bir kishi uchun narx</div>
                                        <div className="info-value">{venue?.price_per_seat} so'm</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-section">
                        <div className="calendar-section">
                            <h2 className="section_title">
                                <i className="fas fa-calendar-alt"></i> Bron kalendari
                            </h2>
                    
                            <div className="calendar-grid" id="calendar-grid">
                                <Calendar
                                    locale="en-US"
                                    onChange={date => {
                                        const today = new Date()
                                        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
                                        if (date >= startOfToday) {
                                            setSelectedDate(date)
                                        }
                                    }}
                                    value={selectedDate}
                                    tileDisabled={({ date, view }) => {
                                        if (view === 'month') {
                                            const today = new Date();
                                            const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                                            return date < startOfToday;
                                        }
                                        return false;
                                    }}
                                    tileClassName={({ date, view }) => {
                                        if (view !== 'month') return 'calendar-header month-year';

                                        const today = new Date();
                                        const isSameDate = (d1, d2) =>
                                            d1 instanceof Date &&
                                            d2 instanceof Date &&
                                            d1.getFullYear() === d2.getFullYear() &&
                                            d1.getMonth() === d2.getMonth() &&
                                            d1.getDate() === d2.getDate();

                                        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                                        let className = 'calendar-day';
                                        if (date < startOfToday) className += ' past';
                                        else if (bookedDates.some(d => isSameDate(d.booking_date, date))) className += ' booked';
                                        else if (isSameDate(date, today)) className += ' today';
                                        else className += ' available';

                                        return className;
                                    }}


                                    navigationLabel={({ date, label, locale, view }) => (
                                        <div className="custom-navigation-label">{label}</div>
                                    )}
                                    nextLabel={<span className="custom-nav-button">›</span>}
                                    prevLabel={<span className="custom-nav-button">‹</span>}
                                />
                            </div>

                            <div className="calendar-legend">
                                <div className="legend-item">
                                    <div className="legend-color legend-available"></div>
                                    <span>Bo'sh</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color legend-booked"></div>
                                    <span>Bron qilingan</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color legend-past"></div>
                                    <span>O'tgan kunlar</span>
                                </div>
                                <div className="legend-item">
                                    <div className="legend-color legend-today"></div>
                                    <span>Bugun</span>
                                </div>
                            </div>
                        </div>

                        <div className="owner-info-section">
                            <h2 className="section_title">
                                <i className="fas fa-user-tie"></i> To'yxona egasi ma'lumotlari
                            </h2>
                            <div className="owner-card">
                                <div className="owner-avatar"><i className="fa-solid fa-user"></i></div>
                                <div className="owner-details">
                                    <div className="owner-name">{venue.owner?.firstname} {venue.owner?.lastname}</div>
                                    <div className="owner-contact">
                                        <i className="fas fa-phone"></i> {venue.owner?.phone_number}
                                    </div>
                                    <div className="owner-contact">
                                        <i className="fas fa-envelope"></i> {venue.owner?.username}
                                    </div>
                                    <div className="owner-status">
                                        <i className="fas fa-check-circle"></i> Tasdiqlangan egasi
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VenuesDetails
