const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String },
    phone: { type: String },
    otp: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['signup', 'login', 'reset_password', 'transfer'],
      required: true,
    },
    isUsed: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OtpVerification', otpSchema);
