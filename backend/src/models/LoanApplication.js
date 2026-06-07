const mongoose = require("mongoose");

const loanApplicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 10000,
    },

    tenureMonths: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    interestRate: {
      type: Number,
      default: 12,
    },

    emi: {
      type: Number,
      required: true,
    },

    totalPayable: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    rejectionReason: {
      type: String,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    reviewedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

loanApplicationSchema.index({ userId: 1 });
loanApplicationSchema.index({ status: 1 });

module.exports = mongoose.model("LoanApplication", loanApplicationSchema);
