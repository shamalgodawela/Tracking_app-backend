import connectDB from "../../lib/db.js";
import Device from "../../Models/Device.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const { deviceId, name } = req.body;

      let exist = await Device.findOne({ deviceId });
      if (exist) {
        return res.json({ success: true, message: "Device already registered", data: exist });
      }

      const newDevice = await Device.create({ deviceId, name });
      res.json({ success: true, data: newDevice });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
