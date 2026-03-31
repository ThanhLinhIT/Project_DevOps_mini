const router = require('express').Router();

router.use('/auth',     require('./auth.routes'));
router.use('/users',    require('./user.routes'));
router.use('/bookings', require('./booking.routes'));
router.use('/courts',   require('./court.routes'));
router.use('/health',   require('./healthRoutes'));
router.use('/about',    require('./aboutRoutes'));

module.exports = router;
