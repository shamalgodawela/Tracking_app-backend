const express2 = require('express');
const router2 = express2.Router();
const locationCtrl = require('../Controller/location');


router2.post('/save', locationCtrl.saveLocationPoints);
router2.get('/:deviceId', locationCtrl.getLocationsByDevice);


module.exports = router2;