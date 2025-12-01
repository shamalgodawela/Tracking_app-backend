const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();     // Load .env

const deviceRoutes = require('./Rotues/device');     
const locationRoutes = require('./Rotues/location');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Routes
app.use('/api/device', deviceRoutes);
app.use('/api/location', locationRoutes);

// Health check
app.get('/', (req, res) => res.send('Executives Tracking API running'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
