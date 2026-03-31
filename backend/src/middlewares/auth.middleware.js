const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ── Verify JWT — injects req.user ──────────────────────────────────────────────
const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Bạn cần đăng nhập để thực hiện thao tác này' });
  }

  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Tài khoản không tồn tại hoặc đã bị khóa' });
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

// ── Require admin role ─────────────────────────────────────────────────────────
const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Chỉ Admin mới có quyền thực hiện thao tác này' });
  }
  next();
};

// ── Optionally attach user (public routes that benefit from user context) ───────
const optionalAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch { /* ignore */ }
  }
  next();
};

module.exports = { protect, adminOnly, optionalAuth };
