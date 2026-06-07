const mongoose = require("mongoose");

const creditSchema = new mongoose.Schema({
  userId: String,
  balance: Number,
  transactions: Number,
  repaymentHistory: Number,
  score: Number,
  rating: String,
});

module.exports = mongoose.model("CreditScore", creditSchema);