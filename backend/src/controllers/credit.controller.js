const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Loan = require("../models/Loan");

exports.getCreditScore = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId missing" });
    }

    const account = await Account.findOne({ userId });
    const transactions = await Transaction.find({ userId });
    const loans = await Loan.find({ userId });

    const balance = account?.balance || 0;

    const totalSpent = transactions.reduce(
      (sum, t) => sum + (t.amount || 0),
      0
    );

    let score = 300;

    score += Math.min(balance / 1000, 300);
    score -= totalSpent / 500;
    score -= loans.length * 50;

    score = Math.max(300, Math.min(850, score));

    return res.json({
      score: Math.round(score),
      rating: score > 750 ? "A" : score > 650 ? "B" : "C",
      eligible: score > 600,
      balance,
      totalSpent,
      transactions,
      loans,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "server error" });
  }
};