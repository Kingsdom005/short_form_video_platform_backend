const router = require('express').Router();
const { getUserGrowth, getVideoGrowth, getTotalWatchTime, getDashboardStats } = require('../controllers/statsController');
const { authMiddleware } = require('../middleware/auth');

router.get('/user-growth', authMiddleware, getUserGrowth);
router.get('/video-growth', authMiddleware, getVideoGrowth);
router.get('/watch-time', authMiddleware, getTotalWatchTime);
router.get('/dashboard', authMiddleware, getDashboardStats);

module.exports = router;