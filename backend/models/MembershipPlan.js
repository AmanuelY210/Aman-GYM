const mongoose = require('mongoose');

const MembershipPlanSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a plan name'], trim: true },
  description: { type: String, required: [true, 'Please add a description'] },
  price: { type: Number, required: [true, 'Please add a price'] },
  duration: { type: Number, required: [true, 'Please add duration in days'] },
  features: [{ type: String }],
  isActive: { type: Boolean, default: true },
  maxClasses: { type: Number, default: -1 },
  maxTrainers: { type: Number, default: -1 },
}, { timestamps: true });

module.exports = mongoose.model('MembershipPlan', MembershipPlanSchema);
