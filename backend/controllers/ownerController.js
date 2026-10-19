const pool = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Booking = require('../models/Booking')
require('dotenv').config()

exports.ownerLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await pool.query(`SELECT * FROM owners WHERE username = $1`, [username])
        if (result.rows.length === 0) {
            res.status(400).json({ message: 'Bunday foydalanuvchi topilmadi' })
        }

        const owner = result.rows[0]
        const isValidPassword = await bcrypt.compare(password, owner.password)
        if (!isValidPassword) {
            res.status(400).json({ message: "Foydalanuvchi Nomi yoki Parol noto'g'ri" })
        }

        const token = jwt.sign(
            { id: owner.id, role: 'owner' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({ owner, token })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.getVenues = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(`
        SELECT 
            v.id, v.name, v.address, v.district, v.capacity, v.price_per_seat, v.phone_number, v.owner_id, v.status, vi.image_url
        FROM venues v
        LEFT JOIN venueImages vi ON v.id = vi.venue_id
        WHERE v.owner_id = $1
        ORDER BY v.id;
        `, [userId]);

        if (result.rows.length === 0) {
            return res.json([])
        }

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
                    status: row.status,
                    images: []
                });
            }

            if (row.image_url) {
                venuesMap.get(venueId).images.push(row.image_url);
            }
        });

        const venues = Array.from(venuesMap.values());

        return res.status(200).json(venues);
    } catch (error) {
        console.error(error);
        return res.status(500).json('Serverda xatolik yuz berdi');
    }
};

exports.getVenueById = async (req, res) => {
    try {
        const venueId = req.params.id;

        const result = await pool.query(`
            SELECT 
                v.id, v.name, v.address, v.district, v.capacity, v.price_per_seat, v.phone_number, v.owner_id, v.status,
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
            status: result.rows[0].status,
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

exports.deleteVenue = async (req, res) => {
    try {
        const venueId = req.params.id
        const venueCheck = await pool.query(`SELECT * FROM venues WHERE id = $1`, [venueId])
        if (venueCheck.rows.length === 0) {
            return res.status(404).json({ message: "To'yxona topilmadi" })
        }

        const result = await pool.query(`DELETE FROM venues WHERE id = $1`, [venueId])
        res.status(200).json({ message: "To'yxona muvaffaqiyatli o'chirildi", venue: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.addVenue = async (req, res) => {
    try {
        const { name, address, district, capacity, price_per_seat, phone_number } = req.body;

        const owner_id = req.user.id;

        if (!name || !address || !district || !capacity || !price_per_seat || !phone_number) {
            return res.status(400).json({ message: `Barcha maydonlar to'ldirilishi shart` });
        }

        const venueResult = await pool.query(
            `INSERT INTO venues (name, address, district, capacity, price_per_seat, phone_number, owner_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, address, district, capacity, price_per_seat, phone_number, owner_id]
        );

        const venueId = venueResult.rows[0].id;

        if (req.files && req.files.length > 0) {
            const insertImagesPromises = req.files.map(file =>
                pool.query(`INSERT INTO venueImages (image_url, venue_id) VALUES ($1, $2)`, [file.filename, venueId])
            );

            await Promise.all(insertImagesPromises);
        }

        res.status(201).json({ message: "To'yxona va rasmlar muvaffaqiyatli qo‘shildi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
    }
};


exports.updateVenue = async (req, res) => {
    try {
        const ownerId = req.user.id
        const venueId = req.params.id
        const { name, address, district, capacity, price_per_seat, phone_number } = req.body

        const venueCheck = await pool.query(`SELECT * FROM venues WHERE id = $1 AND owner_id = $2`, [venueId, ownerId])
        if (venueCheck.rows.length === 0) {
            res.status(403).json({ message: "Siz bu to'yxonani yangilash huquqiga ega emassiz yoki toyxona topilmadi" })
        }

        const result = await pool.query(
            `UPDATE venues
            SET name = $1, address = $2, district = $3, capacity = $4, price_per_seat = $5, phone_number = $6
            WHERE id = $7 RETURNING *`,
            [name, address, district, capacity, price_per_seat, phone_number, venueId]
        )

        res.status(200).json({ message: "To'yxona ma'lumotlari yangilandi", venue: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.ownerBookings = async (req, res) => {
    try {
        const ownerId = req.user.id;

        const result = await pool.query(`
            SELECT 
                b.id,
                b.booking_date,
                b.seats_booked,
                u.id AS user_id,
                u.firstname,
                u.lastname,
                u.phone_number,
                v.id AS venue_id,
                v.name AS venue_name,
                v.district,
                v.address
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN venues v ON b.venue_id = v.id
            WHERE v.owner_id = $1
            ORDER BY b.booking_date DESC
        `, [ownerId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
    }
};


exports.getVenueBookings = async (req, res) => {
    const venueId = req.params.id

    try {
        const bookings = await Booking.findAll({
            where: { venue_id: venueId },
            include: {
                model: User,
                attributes: ['firstname', 'lastname'] // Admin faqat ismlar ko‘radi
            },
            order: [['booking_date', 'ASC']] // Sana bo‘yicha tartiblab beramiz
        })

        res.status(200).json(bookings)
    } catch (error) {
        console.error('Bookinglarni olishda xatolik:', error)
        res.status(500).json({ error: 'Bookinglarni olishda xatolik yuz berdi' })
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking topilmadi" });
        }

        await booking.destroy();

        return res.json({ message: "Booking muvaffaqiyatli o'chirildi" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Serverda xatolik yuz berdi" });
    }
};

