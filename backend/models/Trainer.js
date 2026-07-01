const mongoose = require('mongoose');

const TrainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  specialties: [{ type: String }],
  certifications: [{ name: String, issuedBy: String, year: Number }],
  bio: { type: String, maxlength: [500, 'Bio can not be more than 500 characters'] },
  hourlyRate: { type: Number, required: true },
  availability: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String },
    endTime: { type: String },
  }],
  rating: { type: Number, min: 0, max: 5, default: 0 },
  totalClients: { type: Number, default: 0 },
  yearsExperience: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Trainer', TrainerSchema);
