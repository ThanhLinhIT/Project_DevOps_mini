const express = require('express');
const { getCourts, getCourtSlots } = require('../controllers/courtController');
const router = express.Router();
router.get('/', getCourts);
router.get('/:id/slots', getCourtSlots);
module.exports = router;
