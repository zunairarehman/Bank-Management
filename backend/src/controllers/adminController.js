const User = require("../models/User");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const AuditLog = require("../models/AuditLog");
const Notification = require("../models/Notification");

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalUsers, totalAccounts, totalTransactions, pendingUsers] =
      await Promise.all([
        User.countDocuments(),
        Account.countDocuments({ status: "active" }),
        Transaction.countDocuments(),
        User.countDocuments({ status: "pending" }),
      ]);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTransactions = await Transaction.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo }, status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          volume: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const monthlyRevenue = await Transaction.aggregate([
      { $match: { type: "fee", status: "completed" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const totalBalance = await Account.aggregate([
      { $match: { status: "active" } },
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);

    const fraudAlerts = await Transaction.countDocuments({
      isFraudFlag: true,
      status: "pending",
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalAccounts,
        totalTransactions,
        pendingUsers,
        totalDeposits: totalBalance[0]?.total || 0,
        fraudAlerts,
        dailyTransactions,
        monthlyRevenue,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { fullName: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
    ];
  }
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);
  res.json({ success: true, data: { users, total, page: Number(page) } });
};

exports.updateUserStatus = async (req, res) => {
  const { status } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true },
  ).select("-password");
  if (user && status === "active") {
    await Notification.create({
      userId: user._id,
      title: "Account Approved",
      message: "Your banking account has been approved by admin.",
      type: "system",
    });
  }
  res.json({ success: true, data: user });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
};

exports.getTransactions = async (req, res) => {
  const { status, isFraudFlag, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (isFraudFlag !== undefined) filter.isFraudFlag = isFraudFlag === "true";

  const skip = (page - 1) * limit;
  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("fromUserId toUserId", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Transaction.countDocuments(filter),
  ]);
  res.json({ success: true, data: { transactions, total } });
};

exports.getAccounts = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const accounts = await Account.find(filter)
    .populate("userId", "fullName email phone status")
    .sort({ balance: -1 });
  res.json({ success: true, data: accounts });
};

exports.getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
  res.json({ success: true, data: logs });
};

exports.flagTransaction = async (req, res) => {
  const txn = await Transaction.findByIdAndUpdate(
    req.params.id,
    { isFraudFlag: true, status: "pending" },
    { new: true },
  );
  res.json({ success: true, data: txn });
};
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
