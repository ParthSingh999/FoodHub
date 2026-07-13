const cors = require('cors');   
const express = require('express');
const db = require('./Confiq/db');
const userRoutes = require('./Routes/UserRoutes');


const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);

// Lightweight health endpoints for remote checks
app.get('/', (req, res) => {
    res.send('Backend is up');
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        port: PORT,
        db_env: !!process.env.DATABASE_URL || !!process.env.MYSQL_URL
    });
});


// Authenticate DB first, then start server so the app only listens when DB is reachable
db.authenticate()
    .then(async () => {
        console.log('Database connected successfully');
        try {
            await db.sync();
        } catch (syncErr) {
            console.error('DB sync error:', syncErr);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
        // still start server so health checks can report, but warn
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT} but DB connection failed`);
        });
    });