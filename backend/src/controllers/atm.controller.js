const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const bcrypt = require("bcryptjs");
// PIN CREATE
exports.generatePin = async (req, res) => {
  try {
    const { cardId, pin } = req.body;

    const account = await Account.findOne({ cardId });
    if (!account) return res.status(404).json({ message: "Card not found" });

    account.pin = await bcrypt.hash(pin, 10);
    await account.save();

    res.json({ message: "PIN created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PIN CHANGE
exports.changePin = async (req, res) => {
  try {
    const { cardId, oldPin, newPin } = req.body;

    const account = await Account.findOne({ cardId });
    if (!account) return res.status(404).json({ message: "Card not found" });

    const ok = await bcrypt.compare(oldPin, account.pin);
    if (!ok) return res.status(400).json({ message: "Old PIN wrong" });

    account.pin = await bcrypt.hash(newPin, 10);
    await account.save();

    res.json({ message: "PIN updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// WITHDRAW
exports.withdraw = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    if (account.balance < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    account.balance -= amount;
    await account.save();

    await Transaction.create({
      accountId,
      amount,
      type: "withdraw",
      createdAt: new Date(),
    });

    res.json({ message: "Withdraw success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DEPOSIT
exports.deposit = async (req, res) => {
  try {
    const { accountId, amount } = req.body;

    const account = await Account.findById(accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += amount;
    await account.save();

    await Transaction.create({
      accountId,
      amount,
      type: "deposit",
      createdAt: new Date(),
    });

    res.json({ message: "Deposit success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// BLOCK CARD
exports.blockCard = async (req, res) => {
  try {
    const { cardId } = req.body;

    const account = await Account.findOne({ cardId });
    if (!account) return res.status(404).json({ message: "Card not found" });

    account.isBlocked = true;
    await account.save();

    res.json({ message: "Card blocked" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};