import React, { useEffect, useState } from 'react'
import VenueCard from './VenueCard'
import useAdminStore from '../../zustand/adminStore'
import axios from 'axios'
import Search from '../Search'
import { useNavigate } from 'react-router-dom'

function Venues() {
    const navigate = useNavigate()
    const { venues, loading, error, fetchVenues } = useAdminStore()
    const token = localStorage.getItem('token')

    // State for search, filters, sorts
    const [searchTerm, setSearchTerm] = useState('')
    const [districtFilter, setDistrictFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [priceSort, setPriceSort] = useState(null)  // 'asc' or 'desc'
    const [capacitySort, setCapacitySort] = useState(null) // 'asc' or 'desc'


    useEffect(() => {
        fetchVenues()
    }, [fetchVenues])

    const handleDelete = async (venueId) => {
        if (!window.confirm("Haqiqatdan ham o'chirmoqchimisiz")) return

        try {
            await axios.delete(`http://localhost:3105/admin/venues/${venueId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            fetchVenues()
            navigate('/admin-dashboard')
        } catch (error) {
            console.log(error);
        }
    }


    // Filter and search venues here:
    const filteredVenues = venues.filter(venue => {
        const searchStr = searchTerm.toLowerCase()
        const matchesSearch =
            venue.name.toLowerCase().includes(searchStr) ||
            venue.district.toLowerCase().includes(searchStr)

        // District filter
        const matchesDistrict = districtFilter ? venue.district === districtFilter : true

        // Status filter (assuming venue.status is 'confirmed' or 'unconfirmed')
        const matchesStatus = statusFilter ? venue.status === statusFilter : true

        return matchesSearch && matchesDistrict && matchesStatus
    })

    // Sort the filteredVenues by price or capacity
    const sortedVenues = [...filteredVenues]

    if (priceSort) {
        sortedVenues.sort((a, b) => {
            if (priceSort === 'asc') return a.price_per_seat - b.price_per_seat
            else return b.price_per_seat - a.price_per_seat
        })
    }

    if (capacitySort) {
        sortedVenues.sort((a, b) => {
            if (capacitySort === 'asc') return a.capacity - b.capacity
            else return b.capacity - a.capacity
        })
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
            {error && <h1>{error}</h1>}

            <div className="venues-section">
                <h2 className="venues-title">To'yxonalar ro'yxati</h2>
                <div className="venues-grid" id="venues-grid">
                    {sortedVenues?.map((venue) => {
                        return <VenueCard key={venue.id} venue={venue} onDelete={handleDelete} />
                    })}
                    {sortedVenues.length === 0 && !loading && <p>To'yxona topilmadi.</p>}
                </div>
            </div>
        </div>
    )
}

export default Venues