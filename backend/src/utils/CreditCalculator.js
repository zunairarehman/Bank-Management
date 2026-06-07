function calculateCreditScore(account, transactions) {
  let score = 300; // base score

  // 💰 balance impact
  score += (account.balance || 0) * 0.02;

  // 🔁 transaction activity
  score += (transactions?.length || 0) * 5;

  // ❌ loan penalty
  score -= (account.loanHistory || 0) * 30;

  // limits
  if (score > 850) score = 850;
  if (score < 300) score = 300;

  return Math.floor(score);
}

module.exports = calculateCreditScore;