import React, { useEffect, useState, useCallback } from 'react'
import VenueCard from './VenueCard'
import axios from 'axios'
import Search from '../Search'
import { useNavigate } from 'react-router-dom'

function Venues() {
    const navigate = useNavigate()
    const token = localStorage.getItem('token')

    const [venues, setVenues] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Search va filterlar uchun state'lar
    const [searchTerm, setSearchTerm] = useState('')
    const [districtFilter, setDistrictFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [priceSort, setPriceSort] = useState(null)  // 'asc' yoki 'desc'
    const [capacitySort, setCapacitySort] = useState(null) // 'asc' yoki 'desc'

    // Venues olish funksiyasi, useCallback bilan 
    const fetchVenues = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await axios.get('http://localhost:3105/owner/venues', {
                headers: { Authorization: `Bearer ${token}` }
            })
            setVenues(res.data)
            // console.log(res.data);

        } catch (err) {
            setError('To\'yxonalarni olishda xatolik yuz berdi')
            console.log(err)
        } finally {
            setLoading(false)
        }
    }, [token])

    useEffect(() => {
        fetchVenues()
    }, [fetchVenues])

    // O'chirish funksiyasi
    const handleDelete = async (venueId) => {
        if (!window.confirm("Haqiqatdan ham o'chirmoqchimisiz?")) return
        console.log("Ochirilayotgan venueId:", venueId);

        try {
            await axios.delete(`http://localhost:3105/owner/venues/${venueId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            await fetchVenues()
            navigate('/owner-dashboard') 
        } catch (err) {
            alert('O\'chirishda xatolik yuz berdi')
            console.log(err)
        }
    }

    // Filtrlash va qidiruv:
    const filteredVenues = venues.filter(v => {
        const term = searchTerm.toLowerCase()
        const matchSearch = v.name.toLowerCase().includes(term) || v.district.toLowerCase().includes(term)
        const matchDistrict = districtFilter ? v.district === districtFilter : true
        // Status filtering agar backenddan status kelmasa bu qismni o'zgartiring
        const matchStatus = statusFilter ? v.status === statusFilter : true
        return matchSearch && matchDistrict && matchStatus
    })

    // Saralash:
    const sortedVenues = [...filteredVenues]
    if (priceSort) {
        sortedVenues.sort((a, b) => priceSort === 'asc' ? a.price_per_seat - b.price_per_seat : b.price_per_seat - a.price_per_seat)
    }
    if (capacitySort) {
        sortedVenues.sort((a, b) => capacitySort === 'asc' ? a.capacity - b.capacity : b.capacity - a.capacity)
    }

    return (
        <div>
            <Search
                searchTerm={searchTerm}
                onSearchChange={e => setSearchTerm(e.target.value)}
                districtFilter={districtFilter}
                onDistrictChange={e => setDistrictFilter(e.target.value)}
                statusFilter={statusFilter}
                onStatusChange={e => setStatusFilter(e.target.value)}
                priceSort={priceSort}
                onPriceSortChange={setPriceSort}
                capacitySort={capacitySort}
                onCapacitySortChange={setCapacitySort}
                showStatusFilter={true}
            />

            {loading && <h1>Yuklanmoqda...</h1>}
            {error && <h1 style={{ color: 'red' }}>{error}</h1>}

            <div className="venues-section">
                <h2 className="venues-title">To'yxonalar ro'yxati</h2>
                <div className="venues-grid" id="venues-grid">
                    {sortedVenues.length === 0 && !loading && <p>To'yxona topilmadi.</p>}
                    {sortedVenues.map(venue => (
                        <VenueCard key={venue.id} venue={venue} onDelete={handleDelete} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Venues
