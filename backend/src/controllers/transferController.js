const mongoose = require("mongoose");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const Beneficiary = require("../models/Beneficiary");

const generateReference = () =>
  `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

exports.transferMoney = async (req, res) => {
  try {
    const { toAccountNumber, amount, description } = req.body;
    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount",
      });
    }

    const senderAccount = await Account.findOne({
      userId: req.user._id,
      status: "active",
    });

    if (!senderAccount) {
      return res.status(404).json({
        success: false,
        message: "Sender account not found",
      });
    }

    if (senderAccount.balance < transferAmount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const receiverAccount = await Account.findOne({
      accountNumber: toAccountNumber,
      status: "active",
    });

    if (!receiverAccount) {
      return res.status(404).json({
        success: false,
        message: "Receiver account not found",
      });
    }

    if (senderAccount._id.equals(receiverAccount._id)) {
      return res.status(400).json({
        success: false,
        message: "Cannot transfer to same account",
      });
    }

    senderAccount.balance -= transferAmount;
    senderAccount.dailySpent += transferAmount;
    senderAccount.lastTransactionAt = new Date();

    receiverAccount.balance += transferAmount;
    receiverAccount.lastTransactionAt = new Date();

    await senderAccount.save();
    await receiverAccount.save();

    const reference = generateReference();

    const transaction = await Transaction.create({
      fromAccountId: senderAccount._id,
      toAccountId: receiverAccount._id,
      fromUserId: req.user._id,
      toUserId: receiverAccount.userId,
      amount: transferAmount,
      type: "transfer",
      status: "completed",
      description: description || "Internal Transfer",
      reference,
      category: "transfer",
    });

    await Notification.create([
      {
        userId: req.user._id,
        title: "Transfer Successful",
        message: `PKR ${transferAmount.toLocaleString()} sent to ${toAccountNumber}`,
        type: "transaction",
        metadata: {
          transactionId: transaction._id,
          reference,
        },
      },
      {
        userId: receiverAccount.userId,
        title: "Funds Received",
        message: `PKR ${transferAmount.toLocaleString()} received from ${senderAccount.accountNumber}`,
        type: "transaction",
        metadata: {
          transactionId: transaction._id,
          reference,
        },
      },
    ]);

    // Fraud Warning
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentTransactions = await Transaction.countDocuments({
      fromUserId: req.user._id,
      createdAt: {
        $gte: fiveMinutesAgo,
      },
    });

    if (recentTransactions >= 4) {
      await Notification.create({
        userId: req.user._id,
        title: "Fraud Warning",
        message:
          "Multiple transactions detected within 5 minutes. Please verify your account activity.",
        type: "alert",
      });
    }

    // Low Balance Alert
    if (senderAccount.balance < 1000) {
      await Notification.create({
        userId: req.user._id,
        title: "Low Balance Alert",
        message: "Your account balance has fallen below PKR 1,000.",
        type: "alert",
      });
    }

    res.json({
      success: true,
      message: "Transfer completed successfully",
      data: {
        transaction,
        newBalance: senderAccount.balance,
        receipt: {
          reference,
          amount: transferAmount,
          from: senderAccount.accountNumber,
          to: receiverAccount.accountNumber,
          date: new Date(),
        },
      },
    });
  } catch (err) {
    console.log("Transfer error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getBeneficiaries = async (req, res) => {
  const list = await Beneficiary.find({ userId: req.user._id }).sort({
    isFavorite: -1,
  });
  res.json({ success: true, data: list });
};

exports.addBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.create({
      ...req.body,
      userId: req.user._id,
    });
    res.status(201).json({ success: true, data: beneficiary });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteBeneficiary = async (req, res) => {
  await Beneficiary.findOneAndDelete({
    _id: req.params.id,
    userId: req.user._id,
  });
  res.json({ success: true, message: "Beneficiary removed" });
};
