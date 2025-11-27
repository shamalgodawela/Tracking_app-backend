
const express = require('express');
const router = express.Router();
const deviceCtrl = require('../Controller/device');


router.post('/register', deviceCtrl.registerDevice);
router.get('/:deviceId', deviceCtrl.getDevice);


module.exports = router;