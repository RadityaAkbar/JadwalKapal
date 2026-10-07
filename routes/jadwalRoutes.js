const express = require('express');
const router = express.Router();
const jadwalController = require('../app/controllers/jadwalController');

router.get('/', jadwalController.getAllJadwal);
router.post('/', jadwalController.createJadwal);
router.put('/:id', jadwalController.updateJadwal);
router.delete('/:id', jadwalController.deleteJadwal);

module.exports = router;
