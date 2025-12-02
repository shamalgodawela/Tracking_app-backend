import connectDB from "../../lib/db.js";
import Location from "../../Models/location.js";
import Device from "../../Models/Device.js";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "GET") {
    try {
      // Get all locations with device info
      const locations = await Location.find({})
        .sort({ timestamp: -1 }) // Most recent first
        .limit(100); // Limit to recent 100 visits

      // Get all devices (executives)
      const devices = await Device.find({});

      // Group locations by deviceId and get latest visit for each executive
      const executiveTracking = devices.map((device) => {
        const deviceLocations = locations.filter(
          (loc) => loc.deviceId === device.deviceId
        );
        const latestVisit = deviceLocations[0] || null;
        const totalVisits = deviceLocations.length;

        return {
          deviceId: device.deviceId,
          executiveName: device.name,
          latestVisit: latestVisit
            ? {
                shopName: latestVisit.shopName,
                lat: latestVisit.lat,
                lng: latestVisit.lng,
                timestamp: latestVisit.timestamp,
              }
            : null,
          totalVisits: totalVisits,
          allVisits: deviceLocations.map((loc) => ({
            shopName: loc.shopName,
            lat: loc.lat,
            lng: loc.lng,
            timestamp: loc.timestamp,
          })),
        };
      });

      res.json({ success: true, data: executiveTracking });
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
  