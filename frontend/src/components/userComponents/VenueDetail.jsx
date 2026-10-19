import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';

function VenueDetail() {
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
        const res = await axios.get(`http://localhost:3105/user/venues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setVenue(res.data)
        // console.log(res.data);
        if (res.data.images && res.data.images.length > 0) {
          setMainImage(res.data.images[0]) // birinchi rasm asosiy bo‘ladi
        }
      } catch (err) {
        setError('To\'yxona ma\'lumotlarini olishda xatolik yuz berdi')
      } finally {
        setLoading(false)
      }
    }
    fetchVenue()
  }, [id])

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const res = await axios.get(`http://localhost:3105/user/venues/${id}/booked_dates`);
        setBookedDates(res.data.map(d => new Date(d)));
      } catch (err) {
        console.error("Bron qilingan kunlar olinmadi:", err);
      }
    };
    fetchBookedDates();
  }, [id]);

  if (loading) return <h2>Yuklanmoqda...</h2>
  if (error) return <h2 style={{ color: 'red' }}>{error}</h2>
  if (!venue) return <h2>To'yxona topilmadi</h2>

  const handleSubmit = async (e) => {
    e.preventDefault();

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const selected = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());

    if (selected < startOfToday) {
      alert("O'tgan kunlarga bron qilish mumkin emas.");
      return;
    }

    const firstname = e.target.elements['booking-firstname'].value.trim();
    const lastname = e.target.elements['booking-lastname'].value.trim();
    const phone = e.target.elements['booking-phone'].value.trim();
    const guests = e.target.elements['booking-guests'].value;

    if (!firstname || !lastname || !phone || !guests) {
      alert("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }

    const guestsNumber = parseInt(guests);
    if (guestsNumber < 50 || guestsNumber > 300) {
      alert("Mehmonlar soni 50 dan kam va 300 dan ko'p bo‘lmasligi kerak.");
      return;
    }

    const bookingData = {
      firstname,
      lastname,
      phone,
      guests: guestsNumber,
      date: selectedDate.toISOString().split('T')[0],
      venueId: venue.id,
    };

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3105/user/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Bron muvaffaqiyatli bajarildi!");
      setBookedDates(prev => [...prev, new Date(bookingData.date)])
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Bron qilishda xatolik yuz berdi.");
    }
  };




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
            <Link to='/' className="btn btn-danger">
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
                      d1.getFullYear() === d2.getFullYear() &&
                      d1.getMonth() === d2.getMonth() &&
                      d1.getDate() === d2.getDate();

                    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

                    let className = 'calendar-day';
                    if (date < startOfToday) className += ' past';
                    else if (bookedDates.some(d => isSameDate(d, date))) className += ' booked';
                    else if (isSameDate(date, today)) className += ' today';
                    else className += ' available';

                    if (isSameDate(date, selectedDate)) className += ' selected'; // ✅ Tanlangan kun

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

            <div className="booking-form-section">
              <h2 className="section_title">
                <i className="fas fa-clipboard-list"></i> Bron qilish
              </h2>
              <form id="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="booking-date" className="form-label">Tanlangan sana</label>
                  <input
                    type="text"
                    className="form-control"
                    id="booking-date"
                    value={selectedDate.toLocaleDateString('uz-UZ')}
                    readOnly
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="booking-firstname" className="form-label">Ismingiz</label>
                  <input type="text" className="form-control" id="booking-firstname" placeholder="Ismingizni kiriting" required />
                </div>
                <div className="form-group">
                  <label htmlFor="booking-lastname" className="form-label">Familiyangiz</label>
                  <input type="text" className="form-control" id="booking-lastname" placeholder="Familiyangizni kiriting" required />
                </div>
                <div className="form-group">
                  <label htmlFor="booking-phone" className="form-label">Telefon raqamingiz</label>
                  <input type="tel" className="form-control" id="booking-phone" placeholder="+998 XX XXX XX XX" required />
                </div>
                <div className="form-group">
                  <label htmlFor="booking-guests" className="form-label">Mehmonlar soni</label>
                  <input type="number" className="form-control" id="booking-guests" placeholder='Mehmonlar sonini kiriting' required />
                  <small className="form-text">Minimal 50, maksimal 300 kishi</small>
                </div>
                <button type="submit" className="btn btn-primary submit-btn">
                  <i className="fas fa-check-circle"></i> Bron qilish
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VenueDetail
