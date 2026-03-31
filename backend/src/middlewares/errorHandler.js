// ─── 404 Not Found ────────────────────────────────────────────────────────────
const notFound = (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} không tồn tại` });
};

// ─── Global Error Handler ─────────────────────────────────────────────────────
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  // Mongoose duplicate key → double booking
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'ID không hợp lệ' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};

module.exports = { errorHandler, notFound };
