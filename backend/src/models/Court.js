const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Court', courtSchema);
