const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LoanApplication",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    interestRate: {
      type: Number,
      required: true,
      default: 12,
    },

    tenureMonths: {
      type: Number,
      required: true,
    },

    emi: {
      type: Number,
      required: true,
    },

    totalPayable: {
      type: Number,
      required: true,
    },

    remainingBalance: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["active", "completed", "defaulted"],
      default: "active",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    approvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

loanSchema.index({ userId: 1 });
loanSchema.index({ status: 1 });

module.exports = mongoose.model("Loan", loanSchema);
