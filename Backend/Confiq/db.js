//Config/db.js
require('dotenv').config();

const { Sequelize } = require('sequelize');

const DB_URL =
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  'mysql://root:LTmDVZjrBhmCAYSaBDJKRGnOkNhXiaVo@hayabusa.proxy.rlwy.net:23091/railway';

// ssl is required on Railway cloud; skip it for local dev (no REJECT_UNAUTHORIZED issues)
const useSSL = process.env.DB_SSL === 'true';

const sequelize = new Sequelize(DB_URL, {
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: useSSL
    ? { ssl: { rejectUnauthorized: false } }
    : {},
});

module.exports = sequelize;