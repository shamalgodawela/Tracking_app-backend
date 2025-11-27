const Device = require('../Models/Device');


exports.registerDevice = async (req, res) => {
try {
const { deviceId, name } = req.body;


let exist = await Device.findOne({ deviceId });
if (exist) {
return res.json({ success: true, message: 'Device already registered', data: exist });
}


const newDevice = await Device.create({ deviceId, name });
res.json({ success: true, data: newDevice });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};


exports.getDevice = async (req, res) => {
try {
const deviceId = req.params.deviceId;
const device = await Device.findOne({ deviceId });
res.json({ success: true, data: device });
} catch (err) {
res.status(500).json({ success: false, error: err.message });
}
};