const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    fromAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    toAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true, min: 0.01 },
    type: {
      type: String,
      enum: ['transfer', 'deposit', 'withdrawal', 'bill_payment', 'card_payment', 'fee', 'atm_withdrawal',
'atm_deposit'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'reversed'],
      default: 'pending',
    },
    description: { type: String, default: '' },
    reference: { type: String, unique: true },
    category: { type: String, default: 'general' },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    isFraudFlag: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transactionSchema.index({ fromUserId: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
