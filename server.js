const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const deviceRoutes = require('./Rotues/device');   // Check folder name
const locationRoutes = require('./Rotues/location');

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URI hardcoded
const mongoUri = 'mongodb+srv://shamal:shamal2458@cluster0.xv9lnq5.mongodb.net/?appName=Cluster0';

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// Routes
app.use('/api/device', deviceRoutes);
app.use('/api/location', locationRoutes);

// Health check route
app.get('/', (req, res) => res.send('Executives Tracking API running'));

// MongoDB Connection
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
