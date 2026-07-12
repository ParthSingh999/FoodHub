require('dotenv').config();
const cors = require('cors');
const express = require('express');
const db = require('./Confiq/db');

// ── Load all models so Sequelize registers them before sync ──
require('./Models/UserModel');
require('./Models/VendorModel');
require('./Models/CategoryModel');
require('./Models/ProductModel');
require('./Models/OrderModel');
require('./Models/OrderItemModel');

// ── Routes ───────────────────────────────────────────────────
const userRoutes     = require('./Routes/userRoutes');
const vendorRoutes   = require('./Routes/vendorRoutes');
const productRoutes  = require('./Routes/productRoutes');
const categoryRoutes = require('./Routes/categoryRoutes');
const orderRoutes    = require('./Routes/orderRoutes');

const app  = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users',      userRoutes);
app.use('/api/vendors',    vendorRoutes);
app.use('/api/products',   productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders',     orderRoutes);

// Health endpoints
app.get('/', (req, res) => res.send('Backend is up'));
app.get('/api/health', (req, res) =>
    res.json({ status: 'ok', port: PORT, db: !!process.env.DATABASE_URL })
);

// Connect → sync all tables → start listening
db.authenticate()
    .then(async () => {
        console.log('✅ Database connected');
        try {
            await db.sync({ alter: true }); // safe update, no data loss
            console.log('✅ All tables synced');
        } catch (syncErr) {
            console.error('⚠️  DB sync error:', syncErr.message);
        }
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error('❌ DB connection failed:', err.message);
        app.listen(PORT, () =>
            console.log(`⚠️  Server on port ${PORT} — DB unavailable`)
        );
    });