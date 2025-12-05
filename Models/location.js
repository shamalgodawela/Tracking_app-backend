import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  lat: Number,
  lng: Number,
  speed: Number,
  shopName: { type: String, required: true },
  Dealername:{type:String},
  phonenumber:{type:String},
  timestamp: { type: Date, required: true },
});

export default mongoose.models.Location || mongoose.model("Location", LocationSchema);
