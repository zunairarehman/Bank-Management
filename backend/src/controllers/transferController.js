const mongoose = require("mongoose");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const Beneficiary = require("../models/Beneficiary");

const generateReference = () =>
  `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

exports.transferMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { toAccountNumber, amount, description } = req.body;
    const transferAmount = Number(amount);

    if (!transferAmount || transferAmount <= 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }

    const senderAccount = await Account.findOne({
      userId: req.user._id,
      status: "active",
    }).session(session);
    if (!senderAccount) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Sender account not found" });
    }

    if (senderAccount.balance < transferAmount) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    const receiverAccount = await Account.findOne({
      accountNumber: toAccountNumber,
      status: "active",
    }).session(session);
    if (!receiverAccount) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Receiver account not found" });
    }

    if (senderAccount._id.equals(receiverAccount._id)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Cannot transfer to same account" });
    }

    senderAccount.balance -= transferAmount;
    senderAccount.dailySpent += transferAmount;
    senderAccount.lastTransactionAt = new Date();
    receiverAccount.balance += transferAmount;
    receiverAccount.lastTransactionAt = new Date();

    await senderAccount.save({ session });
    await receiverAccount.save({ session });

    const reference = generateReference();
    const [transaction] = await Transaction.create(
      [
        {
          fromAccountId: senderAccount._id,
          toAccountId: receiverAccount._id,
          fromUserId: req.user._id,
          toUserId: receiverAccount.userId,
          amount: transferAmount,
          type: "transfer",
          status: "completed",
          description: description || "Internal transfer",
          reference,
          category: "transfer",
        },
      ],
      { session },
    );

    await Notification.create(
      [
        {
          userId: req.user._id,
          title: "Transfer Successful",
          message: `PKR ${transferAmount.toLocaleString()} sent to ${toAccountNumber}`,
          type: "transaction",
          metadata: { transactionId: transaction._id, reference },
        },
        {
          userId: receiverAccount.userId,
          title: "Funds Received",
          message: `PKR ${transferAmount.toLocaleString()} received from ${senderAccount.accountNumber}`,
          type: "transaction",
          metadata: { transactionId: transaction._id, reference },
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.json({
      success: true,
      message: "Transfer completed",
      data: {
        transaction,
        newBalance: senderAccount.balance,
        receipt: {
          reference,
          amount: transferAmount,
          from: senderAccount.accountNumber,
          to: toAccountNumber,
          date: new Date(),
        },
      },
    });
  } catch (err) {
    await session.abortTransaction();
    console.log("Transfer error:", err);
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
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
