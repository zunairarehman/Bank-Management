const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: String,
  category: String,
  limit: Number,
  spent: { type: Number, default: 0 }
});

module.exports = mongoose.model("Budget", budgetSchema);