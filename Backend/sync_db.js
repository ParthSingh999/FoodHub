/**
 * sync_db.js — Run once to create all missing tables in Railway MySQL.
 * Usage: node sync_db.js
 */
require('dotenv').config();

const db = require('./Confiq/db');

// Import ALL models so Sequelize registers them before sync
require('./Models/UserModel');
require('./Models/VendorModel');
require('./Models/CategoryModel');
require('./Models/ProductModel');   // defines Category→Product & Vendor→Product associations
require('./Models/OrderModel');     // defines User→Order & Vendor→Order associations
require('./Models/OrderItemModel'); // defines Order→OrderItem & Product→OrderItem associations

async function syncAll() {
  try {
    await db.authenticate();
    console.log('✅ Connected to Railway MySQL');
    console.log('⏳ Syncing all tables (alter: true = safe, no data loss)...\n');

    await db.sync({ alter: true });

    const [tables] = await db.query('SHOW TABLES');
    console.log('✅ Tables in database:');
    tables.forEach(t => console.log('  •', Object.values(t)[0]));
    console.log('\n🎉 All tables are ready!');
  } catch (err) {
    console.error('❌ Sync failed:', err.message);
  } finally {
    await db.close();
  }
}

syncAll();
