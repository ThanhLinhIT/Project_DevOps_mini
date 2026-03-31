const userRepo = require('../repositories/user.repository');

const getAllUsers = () => userRepo.findAll();

const getUserById = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) throw Object.assign(new Error('Người dùng không tồn tại'), { status: 404 });
  return user;
};

const updateUser = async (id, data) => {
  // Never allow password update here — use dedicated endpoint
  delete data.password;
  const user = await userRepo.updateUser(id, data);
  if (!user) throw Object.assign(new Error('Người dùng không tồn tại'), { status: 404 });
  return user;
};

const toggleUserStatus = async (id) => {
  const user = await userRepo.findById(id);
  if (!user) throw Object.assign(new Error('Người dùng không tồn tại'), { status: 404 });
  return userRepo.updateUser(id, { isActive: !user.isActive });
};

const deleteUser = async (id) => {
  const user = await userRepo.deleteUser(id);
  if (!user) throw Object.assign(new Error('Người dùng không tồn tại'), { status: 404 });
};

const getStats = async () => {
  const bookingRepo = require('../repositories/booking.repository');
  const courtRepo   = require('../repositories/court.repository');
  const [totalUsers, totalBookings, totalCourts, booked, confirmed, cancelled] = await Promise.all([
    userRepo.countUsers(),
    bookingRepo.countAll(),
    courtRepo.countAll(),
    bookingRepo.countByStatus('Booked'),
    bookingRepo.countByStatus('Confirmed'),
    bookingRepo.countByStatus('Cancelled'),
  ]);
  return { totalUsers, totalBookings, totalCourts, booked, confirmed, cancelled };
};

module.exports = { getAllUsers, getUserById, updateUser, toggleUserStatus, deleteUser, getStats };
