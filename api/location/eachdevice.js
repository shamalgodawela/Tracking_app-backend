import connectDB from "../../lib/db.js";
import Location from "../../Models/location.js";

export default async function handler(req, res) {
  // --- CORS FIX ---
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  // -----------------

  await connectDB();

  const { deviceId } = req.query;

  if (req.method === "GET") {
    try {
      const data = await Location.find({ deviceId });
      res.json({ success: true, data });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
