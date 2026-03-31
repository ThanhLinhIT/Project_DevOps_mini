const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ message: 'Đăng ký thành công!', ...result });
  } catch (err) { next(err); }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json({ message: 'Đăng nhập thành công!', ...result });
  } catch (err) { next(err); }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);
    res.json({ data: user });
  } catch (err) { next(err); }
};

module.exports = { register, login, getMe };
