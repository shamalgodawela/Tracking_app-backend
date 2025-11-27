require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const device = require('./Rotues/device');
const location = require('./Rotues/location');


const app = express();
const PORT = process.env.PORT || 5000;


// Middleware not needed
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use('/api/device', device);
app.use('/api/location', location);


// Routes placeholder
app.get('/', (req, res) => res.send('Executives Tracking API running'));


// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
