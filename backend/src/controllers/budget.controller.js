const Budget = require("../models/Budget");

// CREATE
exports.createBudget = async (req, res) => {
  const { userId, category, limit } = req.body;

  const budget = await Budget.create({
    userId,
    category,
    limit,
    spent: 0,
  });

  res.json(budget);
};

// GET ALL
exports.getBudgets = async (req, res) => {
  const budgets = await Budget.find();
  res.json(budgets);
};

// EXPENSE
exports.addExpense = async (req, res) => {
  const { budgetId, amount } = req.body;

  const budget = await Budget.findById(budgetId);

  budget.spent += amount;

  await budget.save();

  res.json({ message: "Expense added", budget });
};