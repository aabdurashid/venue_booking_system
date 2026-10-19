const pool = require('../config/db')
require('dotenv').config()
const Booking = require('../models/Booking');
const User = require('../models/User');

exports.allVenues = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT 
            v.id, v.name, v.address, v.district, v.capacity, v.price_per_seat, v.phone_number, v.owner_id, v.status, vi.image_url
        FROM venues v
        LEFT JOIN (
            SELECT DISTINCT ON (venue_id) venue_id, image_url
            FROM venueImages
            ORDER BY venue_id, id ASC
        )  vi ON v.id = vi.venue_id
        WHERE status = 'Tasdiqlangan'
        ORDER BY v.id;
        `);

        const venuesMap = new Map();

        result.rows.forEach(row => {
            const venueId = row.id;

            if (!venuesMap.has(venueId)) {
                venuesMap.set(venueId, {
                    id: row.id,
                    name: row.name,
                    address: row.address,
                    district: row.district,
                    capacity: row.capacity,
                    price_per_seat: row.price_per_seat,
                    phone_number: row.phone_number,
                    owner_id: row.owner_id,
                    images: []
                });
            }

            if (row.image_url) {
                venuesMap.get(venueId).images.push(row.image_url);
            }
        });

        const venues = Array.from(venuesMap.values());

        res.status(200).json(venues);
    } catch (error) {
        console.log(error);
        res.status(500).json("Serverda xatolik yuz berdi")
    }
}

exports.getVenueById = async (req, res) => {
    try {
        const venueId = req.params.id;

        const result = await pool.query(`
            SELECT 
                v.id, v.name, v.address, v.district, v.capacity, v.price_per_seat, v.phone_number, v.owner_id,
                vi.image_url,
                o.firstname, o.lastname, o.phone_number, o.username
            FROM venues v
            INNER JOIN venueimages vi ON v.id = vi.venue_id
            INNER JOIN owners o ON v.owner_id = o.id
            WHERE v.id = $1;
        `, [venueId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'To\'yxona topilmadi' });
        }

        const venue = {
            id: result.rows[0].id,
            name: result.rows[0].name,
            address: result.rows[0].address,
            district: result.rows[0].district,
            capacity: result.rows[0].capacity,
            price_per_seat: result.rows[0].price_per_seat,
            phone_number: result.rows[0].phone_number,
            owner_id: result.rows[0].owner_id,
            images: [],
            owner: {
                firstname: result.rows[0].firstname,
                lastname: result.rows[0].lastname,
                username: result.rows[0].username,
                phone_number: result.rows[0].phone_number,
            },
        };

        result.rows.forEach(row => {
            if (row.image_url) {
                venue.images.push(row.image_url);
            }
        });

        res.status(200).json(venue);

    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi');
    }
};


// Booking yaratish va userni qo‘shish yoki topish
exports.bookings = async (req, res) => {
    try {
        const { firstname, lastname, phone, guests, date, venueId } = req.body;

        // Telefon raqam orqali userni topish yoki yaratish
        let user = await User.findOne({ where: { phone_number: phone } });
        if (!user) {
            user = await User.create({ firstname, lastname, phone_number: phone });
        }

        // Bron yaratish
        const booking = await Booking.create({
            booking_date: date,
            venue_id: venueId,
            user_id: user.id,
            seats_booked: guests
        });

        res.status(201).json({ message: 'Booking created', booking });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Booking yaratishda xatolik' });
    }
};


// Kalendarda ko‘rsatish uchun: Bron qilingan sanalarni olish
exports.booked_dates = async (req, res) => {
    try {
        const { id } = req.params;

        const bookings = await Booking.findAll({
            where: { venue_id: id },
            attributes: ['booking_date']
        });

        const dates = bookings.map(b => b.booking_date);
        res.json(dates);
    } catch (err) {
        res.status(500).json({ error: 'Sanalarni olishda xatolik' });
    }
};


