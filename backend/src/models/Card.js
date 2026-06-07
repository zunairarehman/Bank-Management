const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    cardNumber: { type: String, required: true },
    cardHolderName: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    cvv: { type: String, required: true },
    cardType: { type: String, enum: ['debit', 'credit'], default: 'debit' },
    status: { type: String, enum: ['active', 'frozen', 'blocked'], default: 'active' },
    spendingLimit: { type: Number, default: 100000 },
    dailySpent: { type: Number, default: 0 },
    color: { type: String, default: '#1a365d' },
//ATM
    pinHash: { type: String, default: null },
isATMBlocked: { type: Boolean, default: false },
  },

  { timestamps: true }
);

module.exports = mongoose.model('Card', cardSchema);
