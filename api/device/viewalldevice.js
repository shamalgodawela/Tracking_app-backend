import connectDB from "../../lib/db.js";
import Device from "../../Models/Device.js";

export default async function handler(req, res) {
  // ---- CORS ----
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // ---- Main logic ----
  await connectDB();

  if (req.method === "GET") {
    try {
      const devices = await Device.find({});
      return res.status(200).json({ success: true, data: devices });
    } catch (error) {
      console.error("viewalldevice error:", error);
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
