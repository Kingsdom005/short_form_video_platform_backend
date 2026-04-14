const router = require('express').Router();
const { getUserProfile, getAllUserProfiles } = require('../controllers/userProfileController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getAllUserProfiles);
router.get('/:userId', authMiddleware, getUserProfile);

module.exports = router;