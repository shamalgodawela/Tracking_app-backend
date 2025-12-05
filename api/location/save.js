import connectDB from "../../lib/db.js";
import Location from "../../Models/location.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { deviceId, lat, lng, shopName, timestamp, speed,Dealername,phonenumber } = req.body;

      if (!deviceId || !lat || !lng || !shopName || !timestamp) {
        return res.status(400).json({ success: false, message: "Missing required fields: deviceId, lat, lng, shopName, timestamp" });
      }

      const locationData = {
        deviceId,
        lat,
        lng,
        shopName,
        Dealername,
        phonenumber,
        timestamp: new Date(timestamp),
        speed: speed || null
      };

      await Location.create(locationData);

      res.json({ success: true, message: "Location saved" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
