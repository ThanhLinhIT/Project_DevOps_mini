const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    courtId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
    date:     { type: String, required: true },   // "YYYY-MM-DD"
    timeSlot: { type: String, required: true },   // "06:00-07:00"
    status:   { type: String, enum: ['Booked', 'Confirmed', 'Cancelled', 'Pending'], default: 'Booked' },
  },
  { timestamps: true }
);

// Anti double-booking
bookingSchema.index({ courtId: 1, date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
