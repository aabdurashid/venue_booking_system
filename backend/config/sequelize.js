require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: false,  // agar ssl kerak bo‘lsa true qilib qo‘ying
  },
  logging: false,
});

module.exports = sequelize;
