const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a class name'], trim: true },
  description: { type: String, required: [true, 'Please add a description'] },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'Trainer', required: true },
  category: { type: String, required: true, enum: ['yoga', 'cardio', 'strength', 'hiit', 'pilates', 'dance', 'martial-arts', 'other'] },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  schedule: [{
    day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    maxCapacity: { type: Number, default: 20 },
    currentEnrollment: { type: Number, default: 0 },
  }],
  duration: { type: Number, required: true },
  price: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  image: { type: String, default: 'no-class.jpg' },
}, { timestamps: true });

module.exports = mongoose.model('Class', ClassSchema);
