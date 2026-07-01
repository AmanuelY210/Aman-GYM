const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  membershipPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan' },
  membershipStartDate: { type: Date, default: Date.now },
  membershipEndDate: { type: Date },
  status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
  emergencyContact: { name: String, phone: String, relationship: String },
  fitnessGoals: [String],
  medicalConditions: { type: String, default: '' },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  weight: { type: Number },
  height: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
