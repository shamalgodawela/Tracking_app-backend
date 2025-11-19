const mongoose = require('mongoose');

const PointSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  ts: Date,
  speed: Number,
  accuracy: Number
}, { _id: false });

const RideSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  totalDistanceMeters: { type: Number, default: 0 },
  path: [PointSchema],
  synced: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Ride', RideSchema);
