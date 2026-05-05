const express = require('express');
const router = express.Router();
const { getTodayStreak } = require('../controllers/streakController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/today', protect, getTodayStreak);

module.exports = router;
