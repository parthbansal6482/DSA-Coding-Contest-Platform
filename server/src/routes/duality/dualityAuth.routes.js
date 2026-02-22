const express = require('express');
const router = express.Router();
const { googleLogin, getMe } = require('../../controllers/duality/dualityAuth.controller');
const { protect } = require('../../middleware/dualityAuth');

router.post('/google', googleLogin);
router.get('/me', protect, getMe);

module.exports = router;
