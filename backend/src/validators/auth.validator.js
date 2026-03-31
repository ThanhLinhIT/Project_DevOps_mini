// ── Validators — Auth ─────────────────────────────────────────────────────────

const validateRegister = (req, res, next) => {
  const { fullName, email, password } = req.body;
  const errors = [];
  if (!fullName || fullName.trim().length < 2)
    errors.push('Họ tên phải có ít nhất 2 ký tự');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('Email không đúng định dạng');
  if (!password || password.length < 6)
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];
  if (!email) errors.push('Email là bắt buộc');
  if (!password) errors.push('Mật khẩu là bắt buộc');
  if (errors.length) return res.status(400).json({ error: 'Validation failed', details: errors });
  next();
};

module.exports = { validateRegister, validateLogin };
