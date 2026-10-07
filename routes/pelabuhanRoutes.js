const express = require('express');
const router = express.Router();
const pelabuhanController = require('../app/controllers/pelabuhanController');

router.get('/', pelabuhanController.getAllPelabuhan);
router.post('/', pelabuhanController.createPelabuhan);
router.delete('/:id', pelabuhanController.deletePelabuhan);

module.exports = router;
