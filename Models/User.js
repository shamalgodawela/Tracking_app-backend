const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  createdAt: { type: Date, default: Date.now },
  deviceId: String
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'executive'], default: 'executive' },
  refreshTokens: [RefreshTokenSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
