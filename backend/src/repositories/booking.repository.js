const Booking = require('../models/Booking');

const findAll = () =>
  Booking.find()
    .populate('courtId', 'name location')
    .populate('userId', 'fullName email')
    .sort({ createdAt: -1 });

const findByUser = (userId) =>
  Booking.find({ userId })
    .populate('courtId', 'name location')
    .sort({ createdAt: -1 });

const findById = (id) =>
  Booking.findById(id)
    .populate('courtId', 'name location')
    .populate('userId', 'fullName email');

const create = (data) => Booking.create(data);

const updateStatus = (id, status) =>
  Booking.findByIdAndUpdate(id, { status }, { new: true });

const deleteById = (id) => Booking.findByIdAndDelete(id);

const countAll       = ()  => Booking.countDocuments();
const countByStatus  = (s) => Booking.countDocuments({ status: s });

const findSlotsByCourtAndDate = (courtId, date) =>
  Booking.find({ courtId, date }).select('timeSlot');

module.exports = {
  findAll,
  findByUser,
  findById,
  create,
  updateStatus,
  deleteById,
  countAll,
  countByStatus,
  findSlotsByCourtAndDate,
};
