import connectDB from "../../lib/db.js";
import Location from "../../models/Location.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { deviceId, points } = req.body;

      if (!deviceId || !points || !Array.isArray(points)) {
        return res.status(400).json({ success: false, message: "Invalid payload" });
      }

      await Location.insertMany(points.map((p) => ({ ...p, deviceId })));

      res.json({ success: true, message: "Points saved" });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
