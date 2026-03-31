const courtService = require('../services/court.service');

const getCourts = async (req, res, next) => {
  try {
    const courts = await courtService.getAllCourts();
    res.json({ total: courts.length, data: courts });
  } catch (err) { next(err); }
};

const createCourt = async (req, res, next) => {
  try {
    const court = await courtService.createCourt(req.body);
    res.status(201).json({ message: 'Tạo sân thành công', data: court });
  } catch (err) { next(err); }
};

const updateCourt = async (req, res, next) => {
  try {
    const court = await courtService.updateCourt(req.params.id, req.body);
    res.json({ message: 'Cập nhật sân thành công', data: court });
  } catch (err) { next(err); }
};

const deleteCourt = async (req, res, next) => {
  try {
    await courtService.deleteCourt(req.params.id);
    res.json({ message: 'Xóa sân thành công' });
  } catch (err) { next(err); }
};

module.exports = { getCourts, createCourt, updateCourt, deleteCourt };
