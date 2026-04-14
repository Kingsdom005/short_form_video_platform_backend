const router = require('express').Router();
const { getUsers, getUserById, createUser, updateUser, updatePassword, deleteUser } = require('../controllers/userController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getUsers);
router.get('/:id', authMiddleware, getUserById);
router.post('/', authMiddleware, createUser);
router.put('/:id', authMiddleware, updateUser);
router.put('/:id/password', authMiddleware, updatePassword);
router.delete('/:id', authMiddleware, deleteUser);

module.exports = router;