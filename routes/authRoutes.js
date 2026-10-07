const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/authController');

router.post('/login', authController.login);
router.get('/me', authController.getMe);

module.exports = router;
