const express = require('express')
const { ownerLogin, updateVenue, getVenues, addVenue, deleteVenue, getVenueById, getVenueBookings, ownerBookings, deleteBooking } = require('../controllers/ownerController')
const { authentication } = require('../middlewares/authentication')
const upload = require('../middlewares/uploadMiddleware')
const ownerRouter = express.Router()

ownerRouter.post('/login', ownerLogin)
ownerRouter.get('/venues', authentication, getVenues)
ownerRouter.get('/venues/:id', authentication, getVenueById)
ownerRouter.delete('/venues/:id', authentication, deleteVenue)
ownerRouter.post('/addVenue', authentication, upload.array('images', 5), addVenue)
ownerRouter.put('/venues/:id', authentication, updateVenue)
ownerRouter.get('/allBookings', authentication, ownerBookings)
ownerRouter.get('/venues/:id/bookings', authentication, getVenueBookings)
ownerRouter.delete('/bookings/:id', authentication, deleteBooking)

module.exports = ownerRouter