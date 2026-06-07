const mongoose = require("mongoose");

const loanRepaymentSchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Loan",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    installmentNo: {
      type: Number,
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

loanRepaymentSchema.index({ loanId: 1 });
loanRepaymentSchema.index({ userId: 1 });
loanRepaymentSchema.index({ status: 1 });

module.exports = mongoose.model("LoanRepayment", loanRepaymentSchema);
