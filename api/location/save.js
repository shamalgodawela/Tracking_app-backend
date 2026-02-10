import connectDB from "../../lib/db.js";
import Location from "../../Models/location.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { 
      deviceId, 
      lat, 
      lng, 
      shopName, 
      Dealername, 
      phonenumber, 
      timestamp, 
      speed,
      isAuto // <-- NEW: whether this is auto 100m tracking
    } = req.body;

    if (!deviceId || !lat || !lng || !timestamp) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: deviceId, lat, lng, timestamp"
      });
    }

    await Location.create({
      deviceId,
      lat,
      lng,
      shopName: shopName || null,
      Dealername: Dealername || null,
      phonenumber: phonenumber || null,
      speed: speed || null,
      isAuto: isAuto || false,         // <-- NEW FIELD
      timestamp: new Date(timestamp),
    });

    return res.json({ success: true, message: "Location saved" });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
