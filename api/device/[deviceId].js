import connectDB from "../../lib/db.js";
import Device from "../../Models/Device.js";

export default async function handler(req, res) {
  await connectDB();

  const { deviceId } = req.query;

  if (req.method === "GET") {
    try {
      const device = await Device.findOne({ deviceId });
      res.json({ success: true, data: device });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
