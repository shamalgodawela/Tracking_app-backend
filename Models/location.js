import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  lat: Number,
  lng: Number,
  speed: Number,
  shopName: String,
  Dealername: String,
  phonenumber: String,
  isAuto: { type: Boolean, default: false }, // <--- NEW
  timestamp: { type: Date, required: true },
});

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
