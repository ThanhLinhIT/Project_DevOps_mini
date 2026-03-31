const router = require('express').Router();
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { getCourts, createCourt, updateCourt, deleteCourt } = require('../controllers/court.controller');
const { getCourtSlots } = require('../controllers/booking.controller');

router.get('/',           getCourts);                      // Public
router.get('/:id/slots',  getCourtSlots);                  // Public
router.post('/',      protect, adminOnly, createCourt);    // Admin
router.put('/:id',    protect, adminOnly, updateCourt);    // Admin
router.delete('/:id', protect, adminOnly, deleteCourt);    // Admin

module.exports = router;
