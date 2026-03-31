const Court = require('../models/Court');
const Booking = require('../models/Booking');

const TIME_SLOTS = [
  '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
  '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00',
  '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
  '19:00-20:00', '20:00-21:00',
];

// GET /api/courts
const getCourts = async (req, res, next) => {
  try {
    const courts = await Court.find().sort({ name: 1 });
    res.json({ total: courts.length, data: courts });
  } catch (error) {
    next(error);
  }
};

// GET /api/courts/:id/slots?date=YYYY-MM-DD
const getCourtSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Query param "date" là bắt buộc (YYYY-MM-DD)' });
    }

    const court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({ error: 'Sân không tồn tại' });
    }

    const bookedDocs = await Booking.find({ courtId: id, date }).select('timeSlot');
    const bookedSet  = new Set(bookedDocs.map((b) => b.timeSlot));

    const slots = TIME_SLOTS.map((time) => ({
      time,
      status: bookedSet.has(time) ? 'booked' : 'available',
    }));

    res.json({ courtId: court._id, courtName: court.name, date, slots });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourts, getCourtSlots };
