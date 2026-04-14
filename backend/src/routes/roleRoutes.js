const router = require('express').Router();
const { getRoles, getRoleById, createRole, updateRole, deleteRole, getPermissions, assignRoleToUser, removeRoleFromUser, getUserRoles } = require('../controllers/roleController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, getRoles);
router.get('/:id', authMiddleware, getRoleById);
router.post('/', authMiddleware, createRole);
router.put('/:id', authMiddleware, updateRole);
router.delete('/:id', authMiddleware, deleteRole);
router.get('/permissions/all', authMiddleware, getPermissions);
router.post('/assign', authMiddleware, assignRoleToUser);
router.post('/remove', authMiddleware, removeRoleFromUser);
router.get('/user/:userId', authMiddleware, getUserRoles);

module.exports = router;