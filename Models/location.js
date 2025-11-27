const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  lat: Number,
  lng: Number,
  speed: Number,
  timestamp: { type: Date, required: true }
  });
  
  
  module.exports = mongoose.model('Location', LocationSchema);