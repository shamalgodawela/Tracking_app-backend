const Location = require('../Models/location');


exports.saveLocationPoints = async (req, res) => {
try {
const { deviceId, points } = req.body;


if (!deviceId || !points || !Array.isArray(points)) {
return res.status(400).json({ success: false, message: 'Invalid payload' });
}


await Location.insertMany(points.map(p => ({ ...p, deviceId })));


res.json({ success: true, message: 'Points saved' });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};


exports.getLocationsByDevice = async (req, res) => {
try {
const { deviceId } = req.params;
const data = await Location.find({ deviceId });
res.json({ success: true, data });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};