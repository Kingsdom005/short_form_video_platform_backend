const router = require('express').Router();
const { getRecommendations, getRecommendationStats, getFeatureEngineering } = require('../controllers/recommendationController');
const { authMiddleware } = require('../middleware/auth');

router.get('/:userId', authMiddleware, getRecommendations);
router.get('/stats/overview', authMiddleware, getRecommendationStats);
router.get('/features/:userId', authMiddleware, getFeatureEngineering);

module.exports = router;