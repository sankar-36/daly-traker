const express = require('express');
const router = express.Router();
const { getProgressSummary, getStreakHeatmap, getProgressOverview } = require('../controllers/progressController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/summary', protect, getProgressSummary);
router.get('/streak', protect, getStreakHeatmap);
router.get('/overview', protect, getProgressOverview);

module.exports = router;
