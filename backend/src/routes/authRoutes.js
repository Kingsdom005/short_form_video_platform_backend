const router = require('express').Router();
const { register, login, getCurrentUser, updatePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/update-password', updatePassword);

module.exports = router;
