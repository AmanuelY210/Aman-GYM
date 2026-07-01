const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['membership', 'class', 'personal-training', 'merchandise'], required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed', 'refunded'], default: 'pending' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'bank-transfer', 'online'], required: true },
  invoiceNumber: { type: String, unique: true },
  description: { type: String },
  dueDate: { type: Date },
  paidAt: { type: Date },
}, { timestamps: true });

PaymentSchema.pre('save', async function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  next();
});

module.exports = mongoose.model('Payment', PaymentSchema);
