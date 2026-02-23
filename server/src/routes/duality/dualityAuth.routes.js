const express = require('express');
const router = express.Router();
const { googleLogin, getMe, getAllUsers } = require('../../controllers/duality/dualityAuth.controller');
const { protect, adminOnly } = require('../../middleware/dualityAuth');

router.post('/google', googleLogin);
router.get('/me', protect, getMe);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
