const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");

async function generateCredit(userId) {
  const account = await Account.findOne({ userId });

  if (!account) {
    return {
      score: 0,
      rating: "NO ACCOUNT",
      eligible: false,
      balance: 0,
      transactions: [],
      loans: []
    };
  }

  // 🔥 FIXED TRANSACTION QUERY
  const transactions = await Transaction.find({
    $or: [
      { fromUserId: account.userId },
      { toUserId: account.userId }
    ]
  });

  const loans = await Loan.find({ userId });

  const balance = account.balance;

  const totalSpent = transactions
    .filter(t => String(t.fromUserId) === String(account.userId))
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const txCount = transactions.length;

  const repaymentRatio =
    loans.length === 0
      ? 1
      : loans.filter(l => l.status === "PAID").length / loans.length;

  // 📊 SCORE LOGIC
  let score = 300;

  score += Math.min(balance / 1000, 300);
  score += txCount * 2;
  score += repaymentRatio * 200;

  score = Math.min(850, score);

  return {
    score: Math.round(score),
    rating:
      score > 750 ? "Excellent" :
      score > 650 ? "Good" :
      "Average",

    eligible: score > 650,

    balance,
    transactions,
    totalSpent,
    loans
  };
}

module.exports = { generateCredit };