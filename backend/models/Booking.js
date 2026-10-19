const { DataTypes } = require('sequelize');
const User = require('./User');
const sequelize = require('../config/sequelize');

const Booking = sequelize.define('Booking', {
  booking_date: { type: DataTypes.DATEONLY, allowNull: false },
  venue_id: { type: DataTypes.INTEGER, allowNull: false },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  seats_booked: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'bookings',  // kichik harflarda
  timestamps: false,       // yoki false, agar kerak bo‘lsa
});

Booking.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Booking;
