const bookingRepo = require('../repositories/booking.repository');
const courtRepo   = require('../repositories/court.repository');

const TIME_SLOTS = [
  '06:00-07:00','07:00-08:00','08:00-09:00','09:00-10:00',
  '10:00-11:00','11:00-12:00','13:00-14:00','14:00-15:00',
  '15:00-16:00','16:00-17:00','17:00-18:00','18:00-19:00',
  '19:00-20:00','20:00-21:00',
];

// ── Get all bookings (admin) or own bookings (user) ───────────────────────────
const getBookings = async (user) => {
  const raw = user?.role === 'admin'
    ? await bookingRepo.findAll()
    : await bookingRepo.findByUser(user?._id);

  return raw.map(formatBooking);
};

// ── Create booking ────────────────────────────────────────────────────────────
const createBooking = async ({ fullName, phone, courtId, date, timeSlot }, userId) => {
  const court = await courtRepo.findById(courtId);
  if (!court) throw Object.assign(new Error('Sân không tồn tại'), { status: 404 });

  const booking = await bookingRepo.create({
    fullName: fullName.trim(),
    phone:    phone.trim(),
    courtId,
    date,
    timeSlot,
    userId:   userId || null,
    status:   'Booked',
  });

  await booking.populate('courtId', 'name location');

  return {
    message: 'Đặt sân thành công! 🎉',
    data: formatBooking(booking),
  };
};

// ── Update booking status (admin) ─────────────────────────────────────────────
const updateBookingStatus = async (id, status) => {
  const valid = ['Booked', 'Confirmed', 'Cancelled', 'Pending'];
  if (!valid.includes(status))
    throw Object.assign(new Error('Trạng thái không hợp lệ'), { status: 400 });

  const booking = await bookingRepo.updateStatus(id, status);
  if (!booking) throw Object.assign(new Error('Booking không tồn tại'), { status: 404 });
  return booking;
};

// ── Delete booking (admin) ────────────────────────────────────────────────────
const deleteBooking = async (id) => {
  const b = await bookingRepo.deleteById(id);
  if (!b) throw Object.assign(new Error('Booking không tồn tại'), { status: 404 });
};

// ── Get slot availability ─────────────────────────────────────────────────────
const getCourtSlots = async (courtId, date) => {
  const court = await courtRepo.findById(courtId);
  if (!court) throw Object.assign(new Error('Sân không tồn tại'), { status: 404 });

  const booked  = await bookingRepo.findSlotsByCourtAndDate(courtId, date);
  const bookedSet = new Set(booked.map((b) => b.timeSlot));

  return {
    courtId: court._id,
    courtName: court.name,
    date,
    slots: TIME_SLOTS.map((time) => ({
      time,
      status: bookedSet.has(time) ? 'booked' : 'available',
    })),
  };
};

// ── Format helper ─────────────────────────────────────────────────────────────
const formatBooking = (b) => ({
  id:        b._id,
  fullName:  b.fullName,
  phone:     b.phone,
  court:     b.courtId?.name    || 'N/A',
  location:  b.courtId?.location|| '',
  courtId:   b.courtId?._id,
  bookedBy:  b.userId?.fullName || null,
  bookedByEmail: b.userId?.email || null,
  userId:    b.userId?._id || null,
  date:      b.date,
  timeSlot:  b.timeSlot,
  status:    b.status,
  createdAt: b.createdAt,
});

module.exports = { getBookings, createBooking, updateBookingStatus, deleteBooking, getCourtSlots };
