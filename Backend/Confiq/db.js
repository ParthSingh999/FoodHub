//Config/db.js

 const { Sequelize } = require('sequelize');

 const sequelize = new Sequelize('mysql://root:LTmDVZjrBhmCAYSaBDJKRGnOkNhXiaVo@hayabusa.proxy.rlwy.net:23091/railway', {
   dialect: 'mysql'
 });

module.exports = sequelize;