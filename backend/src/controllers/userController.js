const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Card = require('../models/Card');
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getDashboard = async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user._id, status: 'active' });
    const recentTransactions = await Transaction.find({
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('fromAccountId toAccountId', 'accountNumber');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const spending = await Transaction.aggregate([
      {
        $match: {
          fromUserId: req.user._id,
          status: 'completed',
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    res.json({
      success: true,
      data: {
        balance: account?.balance || 0,
        accountNumber: account?.accountNumber,
        accountType: account?.accountType,
        recentTransactions,
        spendingAnalytics: spending,
        savingsOverview: {
          savings: account?.balance || 0,
          monthlyGoal: 100000,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const { search, type, status, page = 1, limit = 20 } = req.query;
    const filter = {
      $or: [{ fromUserId: req.user._id }, { toUserId: req.user._id }],
    };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (search) filter.reference = new RegExp(search, 'i');

    const skip = (page - 1) * limit;
    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Transaction.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: { transactions, total, page: Number(page), pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCards = async (req, res) => {
  const cards = await Card.find({ userId: req.user._id }).select('-cvv');
  res.json({ success: true, data: cards });
};

exports.updateCardStatus = async (req, res) => {
  const { status } = req.body;
  const card = await Card.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status },
    { new: true }
  ).select('-cvv');
  res.json({ success: true, data: card });
};

exports.payBill = async (req, res) => {
  const session = await require('mongoose').startSession();
  session.startTransaction();
  try {
    const { billType, consumerNumber, provider, amount } = req.body;
    const account = await Account.findOne({ userId: req.user._id, status: 'active' }).session(
      session
    );
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    account.balance -= amount;
    await account.save({ session });

    const reference = `BILL${Date.now()}`;
    const [txn] = await Transaction.create(
      [
        {
          fromAccountId: account._id,
          fromUserId: req.user._id,
          amount,
          type: 'bill_payment',
          status: 'completed',
          description: `${billType} bill - ${provider}`,
          reference,
          category: billType,
        },
      ],
      { session }
    );

    const [bill] = await Bill.create(
      [
        {
          userId: req.user._id,
          accountId: account._id,
          billType,
          consumerNumber,
          provider,
          amount,
          status: 'paid',
          transactionId: txn._id,
          paidAt: new Date(),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    res.json({ success: true, data: { bill, transaction: txn, newBalance: account.balance } });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: err.message });
  } finally {
    session.endSession();
  }
};

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ success: true, data: notifications });
};

exports.markNotificationRead = async (req, res) => {
  await Notification.updateOne({ _id: req.params.id, userId: req.user._id }, { isRead: true });
  res.json({ success: true });
};

exports.updateProfile = async (req, res) => {
  const allowed = ['fullName', 'phone', 'profileImage', 'preferences'];
  const updates = {};
  allowed.forEach((k) => {
    if (req.body[k] !== undefined) updates[k] = req.body[k];
  });
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select(
    '-password'
  );
  res.json({ success: true, data: user });
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: 'Current password incorrect' });
  }
  user.password = newPassword;
  await user.save();
  res.json({ success: true, message: 'Password updated' });
};
