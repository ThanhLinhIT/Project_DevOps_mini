const jwt        = require('jsonwebtoken');
const userRepo   = require('../repositories/user.repository');

// ── Generate JWT ──────────────────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

// ── Register ──────────────────────────────────────────────────────────────────
const register = async ({ fullName, email, password, phone }) => {
  const existing = await userRepo.findByEmail(email);
  if (existing) throw Object.assign(new Error('Email đã được sử dụng'), { status: 409 });

  const user  = await userRepo.createUser({ fullName, email, password, phone });
  const token = signToken(user);

  return {
    token,
    user: { id: user._id, fullName: user.fullName, email: user.email, role: user.role },
  };
};

// ── Login ─────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  const user = await userRepo.findByEmail(email); // password not stripped for login check
  const raw  = await require('../models/User').findOne({ email }); // with password
  if (!raw || !(await raw.comparePassword(password))) {
    throw Object.assign(new Error('Email hoặc mật khẩu không đúng'), { status: 401 });
  }
  if (!raw.isActive) {
    throw Object.assign(new Error('Tài khoản đã bị khóa'), { status: 403 });
  }

  const token = signToken(raw);
  return {
    token,
    user: { id: raw._id, fullName: raw.fullName, email: raw.email, role: raw.role },
  };
};

// ── Get profile ───────────────────────────────────────────────────────────────
const getProfile = async (userId) => userRepo.findById(userId);

module.exports = { register, login, getProfile };
