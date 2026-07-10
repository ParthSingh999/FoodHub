const cors = require('cors');   
const express = require('express');
const db = require('./Confiq/db');
const userRoutes = require('./Routes/UserRoutes');


const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);


db.authenticate().then(() => {
    console.log('Database connected successfully');
    db.sync({ force: true });
})
.catch((err) => {
    console.error('Unable to connect to the database:', err);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});