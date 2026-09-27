require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');

// Import routes
const kapalRoutes = require('./routes/kapalRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/kapal', kapalRoutes);

const PORT = process.env.PORT || 5000;

// Connect to DB and Start Server
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully.');
        // Sync models
        return sequelize.sync(); 
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
        
        // Start server anyway to allow frontend testing without db if needed, or simply fail gracefully
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}, but Database is offline.`);
        });
    });
