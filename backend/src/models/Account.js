const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountNumber: { type: String, required: true, unique: true },
    accountType: {
      type: String,
      enum: ['savings', 'current', 'salary'],
      default: 'savings',
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: 'PKR' },
    status: {
      type: String,
      enum: ['active', 'frozen', 'closed'],
      default: 'active',
    },
    dailyTransferLimit: { type: Number, default: 500000 },
    dailySpent: { type: Number, default: 0 },
    lastTransactionAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Account', accountSchema);
