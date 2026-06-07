const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nickname: { type: String, required: true },
    accountNumber: { type: String, required: true },
    bankName: { type: String, default: 'Bank AL Habib' },
    accountHolderName: { type: String, required: true },
    isFavorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

beneficiarySchema.index({ userId: 1, accountNumber: 1 }, { unique: true });

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
