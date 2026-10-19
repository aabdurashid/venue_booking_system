const pool = require('../config/db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const Booking = require('../models/Booking')
const User = require('../models/User')
const { Op } = require('sequelize')

exports.createAdmin = async (req, res) => {
    try {
        const { username, password, firstname, lastname, phone_number } = req.body
        if (!username || !password) {
            res.status(400).json({ message: "Foydalanuvchi Nomi va Parol bo'lishi kerak" })
        }

        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)

        const userCheck = await pool.query(`SELECT id FROM admins WHERE username = $1`, [username])
        if (userCheck.rows.length > 0) {
            res.status(400).json({ message: 'Bunday Foydalanuvchi Nomi allaqachon mavjud' })
        }

        const result = await pool.query(
            `INSERT INTO admins (username, password, firstname, lastname, phone_number)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [username, encryptedPassword, firstname, lastname, phone_number]
        )

        res.status(201).json({ message: 'Admin yaratildi', admin: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}


exports.adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body
        const result = await pool.query(`SELECT * FROM admins WHERE username = $1`, [username])
        if (result.rows.length === 0) {
            res.status(400).json({ message: 'Bunday foydalanuvchi topilmadi' })
        }

        const admin = result.rows[0]
        const isValidPassword = await bcrypt.compare(password, admin.password)
        if (!isValidPassword) {
            res.status(400).json({ message: "Foydalanuvchi Nomi yoki Parol noto'g'ri" })
        }

        const token = jwt.sign(
            { id: admin.id, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.status(200).json({ admin, token })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.getVenues = async (req, res) => {
    try {
        const result = await pool.query(`
        SELECT 
            v.id, v.name, v.address, v.district, v.capacity, v.price_per_seat, v.phone_number, v.owner_id, v.status, 
            vi.image_url
        FROM venues v
        LEFT JOIN (
            SELECT DISTINCT ON (venue_id) venue_id, image_url
            FROM venueImages
            ORDER BY venue_id, id ASC
        )  vi ON v.id = vi.venue_id
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
                    status: row.status,
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
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.addVenue = async (req, res) => {
    try {
        const { name, address, district, capacity, price_per_seat, phone_number, owner_id } = req.body
        if (!name || !address || !district || !capacity || !price_per_seat) {
            res.status(400).json({ message: 'Kerakli maydonlar to‘liq to‘ldirilishi shart' });
        }

        const venueResult = await pool.query(
            `INSERT INTO venues (name, address, district, capacity, price_per_seat, phone_number, owner_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [name, address, district, capacity, price_per_seat, phone_number, owner_id, "Tasdiqlangan"]
        )

        const venueId = venueResult.rows[0].id
        if (req.files && req.files.length > 0) {
            const insertImagesPromises = req.files.map(file =>
                pool.query(`INSERT INTO venueImages (image_url, venue_id) VALUES ($1, $2)`, [file.filename, venueId])
            )

            await Promise.all(insertImagesPromises)
        }

        res.status(201).json({ message: "To'yxona va uning rasmlari muvaffaqiyatli qo'shildi" })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.createOwner = async (req, res) => {
    try {
        const { username, password, firstname, lastname, phone_number } = req.body
        if (!username || !password) {
            res.status(400).json({ message: "Foydalanuvchi Nomi va Parol bo'lishi kerak" })
        }

        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)

        const existingOwner = await pool.query(`SELECT id FROM owners WHERE username = $1`, [username])
        if (existingOwner.rows.length > 0) {
            res.status(400).json({ message: 'Bunday Foydalanuvchi Nomi allaqachon mavjud' })
        }

        const result = await pool.query(
            `INSERT INTO owners (username, password, firstname, lastname, phone_number)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [username, encryptedPassword, firstname, lastname, phone_number]
        )

        res.status(201).json({ message: 'Owner yaratildi', owner: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.deleteOwner = async (req, res) => {
    try {
        const ownerId = req.params.id;

        const owner = await pool.query('SELECT * FROM owners WHERE id = $1', [ownerId]);
        if (owner.rows.length === 0) {
            return res.status(404).json({ message: 'Owner topilmadi' });
        }

        await pool.query('DELETE FROM owners WHERE id = $1', [ownerId]);

        res.status(200).json({ message: 'Owner muvaffaqiyatli o\'chirildi' });
    } catch (error) {
        console.error('Owner o\'chirishda xatolik:', error);
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
    }
};


exports.deleteVenue = async (req, res) => {
    try {
        const venueId = req.params.id
        const venueCheck = await pool.query(`SELECT * FROM venues WHERE id = $1`, [venueId])
        if (venueCheck.rows.length === 0) {
            res.status(404).json({ message: "To'yxona topilmadi" })
        }

        const result = await pool.query(`DELETE FROM venues WHERE id = $1`, [venueId])
        res.status(200).json({ message: "To'yxona muvaffaqiyatli o'chirildi", venue: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.updateVenue = async (req, res) => {
    try {
        const venueId = req.params.id
        const { name, address, district, capacity, price_per_seat, phone_number, owner_id } = req.body

        const existingImagesRaw = req.body.existingImages;
        let existingImages = [];

        if (existingImagesRaw) {
            try {
                existingImages = JSON.parse(existingImagesRaw);
            } catch (err) {
                console.error('Existing images JSON parse error:', err);
            }
        }

        const result = await pool.query(
            `UPDATE venues
            SET name = $1, address = $2, district = $3, capacity = $4, price_per_seat = $5, phone_number = $6, owner_id = $7
            WHERE id = $8 RETURNING *`,
            [name, address, district, capacity, price_per_seat, phone_number, owner_id, venueId]
        )

        if (req.files && req.files.length > 0) {
            await pool.query(`DELETE FROM venueImages WHERE venue_id = $1`, [venueId]);
            const insertImagesPromises = req.files.map(file =>
                pool.query(`INSERT INTO venueImages (image_url, venue_id) VALUES ($1, $2)`, [file.filename, venueId])
            )

            await Promise.all(insertImagesPromises)
        } else if (existingImages && existingImages.length > 0) {
            await pool.query(`DELETE FROM venueImages WHERE venue_id = $1`, [venueId]);
            const insertImagesPromises = existingImages.map(img =>
                pool.query(`INSERT INTO venueImages (image_url, venue_id) VALUES ($1, $2)`, [img, venueId])
            );
            await Promise.all(insertImagesPromises);
        }

        res.status(200).json({ message: "To'yxona ma'lumotlari yangilandi", venue: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

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

        res.status(200).json({ venue });

    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi');
    }
};

exports.approveVenue = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query(`UPDATE venues SET status = 'Tasdiqlangan' WHERE id = $1`, [id]);
        res.status(200).json({ message: "To'yxona tasdiqlandi" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Xatolik yuz berdi' });
    }
};

exports.getAllOwners = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM owners`)
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.getAllBookings = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                b.id, 
                v.name AS venue_name, 
                b.booking_date, 
                b.seats_booked, 
                u.firstname || ' ' || u.lastname AS booked_by,
                u.phone_number,
            FROM bookings b
            JOIN venues v ON b.venue_id = v.id
            JOIN users u ON b.user_id = u.id
            ORDER BY b.booking_date ASC`
        )
        res.status(200).json(result.rows)
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

exports.cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id
        const result = await pool.query(`DELETE FROM bookings WHERE id = $1`, [bookingId])
        res.status(200).json({ message: "Bron muvaffaqiyatli bekor qilindi", booking: result.rows[0] })
    } catch (error) {
        console.log(error);
        res.status(500).json('Serverda xatolik yuz berdi')
    }
}

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

exports.allBookings = async (req, res) => {
    try {
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
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Serverda xatolik yuz berdi' });
    }
};

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

