const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'completed', 'no-show'], default: 'confirmed' },
  notes: { type: String },
}, { timestamps: true });

BookingSchema.index({ member: 1, class: 1, date: 1 });

module.exports = mongoose.model('Booking', BookingSchema);
