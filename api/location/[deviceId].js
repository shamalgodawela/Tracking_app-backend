import connectDB from "../../lib/db.js";
import Location from "../../models/Location.js";

export default async function handler(req, res) {
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
