const courtRepo = require('../repositories/court.repository');

const getAllCourts = () => courtRepo.findAll();

const createCourt = async ({ name, location }) => {
  if (!name?.trim()) throw Object.assign(new Error('Tên sân là bắt buộc'), { status: 400 });
  return courtRepo.create({ name: name.trim(), location: location?.trim() || '' });
};

const updateCourt = async (id, data) => {
  const court = await courtRepo.update(id, data);
  if (!court) throw Object.assign(new Error('Sân không tồn tại'), { status: 404 });
  return court;
};

const deleteCourt = async (id) => {
  const court = await courtRepo.deleteById(id);
  if (!court) throw Object.assign(new Error('Sân không tồn tại'), { status: 404 });
};

module.exports = { getAllCourts, createCourt, updateCourt, deleteCourt };
