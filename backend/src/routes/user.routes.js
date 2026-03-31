const router = require('express').Router();
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const {
  getAllUsers, getUserById, updateUser, toggleUserStatus, deleteUser, getStats
} = require('../controllers/user.controller');

// Admin only routes
router.use(protect, adminOnly);

router.get('/stats',       getStats);
router.get('/',            getAllUsers);
router.get('/:id',         getUserById);
router.put('/:id',         updateUser);
router.patch('/:id/toggle', toggleUserStatus);
router.delete('/:id',      deleteUser);

module.exports = router;
