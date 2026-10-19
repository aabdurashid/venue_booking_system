const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const User = sequelize.define('User', {
  firstname: { type: DataTypes.STRING, allowNull: false },
  lastname: { type: DataTypes.STRING, allowNull: false },
  phone_number: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'users',  // kichik harf bilan bazadagi jadval nomi
  timestamps: false,
});

module.exports = User;
