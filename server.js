require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import models
require('./app/models/Admin');
require('./app/models/Jadwal'); // memuat Kapal & Pelabuhan juga

// Import routes
const authRoutes = require('./routes/authRoutes');
const kapalRoutes = require('./routes/kapalRoutes');
const pelabuhanRoutes = require('./routes/pelabuhanRoutes');
const jadwalRoutes = require('./routes/jadwalRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/kapal', kapalRoutes);
app.use('/api/pelabuhan', pelabuhanRoutes);
app.use('/api/jadwal', jadwalRoutes);

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        return sequelize.sync({ alter: true }); 
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
        console.log('\n--- PERHATIAN: Database belum berjalan atau belum ada ---');
        console.log('Pastikan MySQL server sudah berjalan dan database "jadwal_kapal_db" telah dibuat.');
        
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}, but Database is offline.`);
        });
    });
