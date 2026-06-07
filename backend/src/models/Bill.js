const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    billType: {
      type: String,
      enum: ['electricity', 'gas', 'internet', 'mobile'],
      required: true,
    },
    consumerNumber: { type: String, required: true },
    provider: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    dueDate: { type: Date },
    paidAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Bill', billSchema);
