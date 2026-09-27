const express = require('express');
const router = express.Router();
const kapalController = require('../app/controllers/kapalController');

router.get('/', kapalController.getAllKapal);
router.post('/', kapalController.createKapal);

module.exports = router;
