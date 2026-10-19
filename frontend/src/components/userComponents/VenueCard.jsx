import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function VenueCard({ venue, }) {
    return (
        <div>
            <Link to={`/venues/${venue.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="venue-card" data-price="15000000" data-capacity="500" data-district="yunusobod" data-status="confirmed">
                    <div className="venue-image">
                        <img src={`http://localhost:3105/uploads/${venue?.images?.[0]}`} alt="Saroy Nur" />
                    </div>
                    <div className="venue-content">
                        <h3 className="venue-title">{venue?.name}</h3>
                        <div className="venue-location">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>{venue?.address}, {venue?.district}</span>
                        </div>
                        <div className="venue-details">
                            <div className="venue-detail">
                                <i className="fas fa-users"></i>
                                <span>{venue?.capacity} ta mehmon</span>
                            </div>
                            <div className="venue-detail">
                                <i className="fa-solid fa-phone"></i>
                                <span>{venue?.phone_number}</span>
                            </div>
                            <div className="venue-detail">
                                <i className="fas fa-utensils"></i>
                                <span>Restoran</span>
                            </div>
                            <div className="venue-detail">
                                <i className="fas fa-star"></i>
                                <span>4.8 (120 sharh)</span>
                            </div>
                        </div>
                        <div className="venue-price">
                            {venue?.price_per_seat} <span>so'm (1 kishi uchun)</span>
                        </div>
                    </div>
                </div>

            </Link>
        </div>
    )
}

export default VenueCard