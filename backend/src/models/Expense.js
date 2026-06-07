const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  amount: {
    type: Number,
    required: true,
  },

  category: {
    type: String,
    enum: ["Food", "Bills", "Transport", "Shopping", "Other"],
    required: true,
  },

  note: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);