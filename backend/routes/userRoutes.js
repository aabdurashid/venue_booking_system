const express = require('express')
const { allVenues, getVenueById, bookings, booked_dates } = require('../controllers/userController')
const userRouter = express.Router()

userRouter.get('/venues', allVenues)
userRouter.get('/venues/:id', getVenueById)
userRouter.post('/bookings', bookings)
userRouter.get('/venues/:id/booked_dates', booked_dates)

module.exports = userRouter

