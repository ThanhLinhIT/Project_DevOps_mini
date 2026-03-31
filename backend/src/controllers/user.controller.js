const userService = require('../services/user.service');

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ total: users.length, data: users });
  } catch (err) { next(err); }
};

const getUserById = async (req, res, next) => {
  try {
    res.json({ data: await userService.getUserById(req.params.id) });
  } catch (err) { next(err); }
};

const updateUser = async (req, res, next) => {
  try {
    res.json({ message: 'Cập nhật thành công', data: await userService.updateUser(req.params.id, req.body) });
  } catch (err) { next(err); }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    res.json({ data: await userService.toggleUserStatus(req.params.id) });
  } catch (err) { next(err); }
};

const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'Xóa người dùng thành công' });
  } catch (err) { next(err); }
};

const getStats = async (req, res, next) => {
  try {
    res.json({ data: await userService.getStats() });
  } catch (err) { next(err); }
};

module.exports = { getAllUsers, getUserById, updateUser, toggleUserStatus, deleteUser, getStats };
