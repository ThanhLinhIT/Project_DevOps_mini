const Booking = require('../models/Booking');
const Court   = require('../models/Court');

// POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { fullName, phone, courtId, date, timeSlot } = req.body;

    // ── Validation ────────────────────────────────────────────────────────────
    const errors = [];
    if (!fullName || fullName.trim().length < 2)
      errors.push('Họ tên phải có ít nhất 2 ký tự');
    if (!phone || !/^\d{10}$/.test(phone.trim()))
      errors.push('Số điện thoại phải gồm đúng 10 chữ số');
    if (!courtId)
      errors.push('Vui lòng chọn sân');
    if (!date)
      errors.push('Vui lòng chọn ngày');
    if (!timeSlot)
      errors.push('Vui lòng chọn khung giờ');

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    // ── Date must not be in the past ──────────────────────────────────────────
    const today = new Date().toISOString().split('T')[0];
    if (date < today) {
      return res.status(400).json({ error: 'Không thể đặt sân cho ngày đã qua' });
    }

    // ── Court must exist ──────────────────────────────────────────────────────
    const court = await Court.findById(courtId);
    if (!court) {
      return res.status(404).json({ error: 'Sân không tồn tại' });
    }

    // ── Create booking (unique index handles double booking → 11000 error) ────
    const booking = await Booking.create({
      fullName: fullName.trim(),
      phone:    phone.trim(),
      courtId,
      date,
      timeSlot,
      status: 'Booked',
    });

    await booking.populate('courtId', 'name location');

    res.status(201).json({
      message: 'Đặt sân thành công! 🎉',
      data: {
        id:        booking._id,
        fullName:  booking.fullName,
        phone:     booking.phone,
        court:     booking.courtId.name,
        location:  booking.courtId.location,
        date:      booking.date,
        timeSlot:  booking.timeSlot,
        status:    booking.status,
        createdAt: booking.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings
const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('courtId', 'name location')
      .sort({ createdAt: -1 });

    const data = bookings.map((b) => ({
      id:        b._id,
      fullName:  b.fullName,
      phone:     b.phone,
      court:     b.courtId?.name   || 'N/A',
      location:  b.courtId?.location || '',
      date:      b.date,
      timeSlot:  b.timeSlot,
      status:    b.status,
      createdAt: b.createdAt,
    }));

    res.json({ total: data.length, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings };
