// ── Validators — Booking ──────────────────────────────────────────────────────

const validateCreateBooking = (req, res, next) => {
  const { fullName, phone, courtId, date, timeSlot } = req.body;
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

  const today = new Date().toISOString().split('T')[0];
  if (date && date < today)
    errors.push('Không thể đặt sân cho ngày đã qua');

  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

module.exports = { validateCreateBooking };
