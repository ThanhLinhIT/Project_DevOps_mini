const bookingService = require('../services/booking.service');

const getBookings = async (req, res, next) => {
  try {
    const data = await bookingService.getBookings(req.user);
    res.json({ total: data.length, data });
  } catch (err) { next(err); }
};

const createBooking = async (req, res, next) => {
  try {
    const result = await bookingService.createBooking(req.body, req.user?._id);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const updated = await bookingService.updateBookingStatus(req.params.id, req.body.status);
    res.json({ message: 'Cập nhật trạng thái thành công', data: updated });
  } catch (err) { next(err); }
};

const deleteBooking = async (req, res, next) => {
  try {
    await bookingService.deleteBooking(req.params.id);
    res.json({ message: 'Xóa booking thành công' });
  } catch (err) { next(err); }
};

const getCourtSlots = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: 'Query param "date" là bắt buộc (YYYY-MM-DD)' });
    res.json(await bookingService.getCourtSlots(id, date));
  } catch (err) { next(err); }
};

module.exports = { getBookings, createBooking, updateBookingStatus, deleteBooking, getCourtSlots };
