const User = require('../models/User');
const Admin = require('../models/Admin');
const Session = require('../models/Session');
const OtpVerification = require('../models/OtpVerification');
const Account = require('../models/Account');
const Notification = require('../models/Notification');
const { signToken, getExpiryDate } = require('../utils/token');
const generateAccountNumber = require('../utils/generateAccountNumber');
const generateOtp = require('../utils/generateOtp');

const createSession = async (token, userId, adminId, req) => {
  await Session.create({
    userId,
    adminId,
    token,
    deviceInfo: req.headers['user-agent'] || 'unknown',
    ipAddress: req.ip || '',
    expiresAt: getExpiryDate(),
  });
};

exports.userSignup = async (req, res) => {
  try {
    const { fullName, email, phone, password, cnic } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { phone }, { cnic }] });
    if (exists) return res.status(400).json({ success: false, message: 'User already exists' });

    const user = await User.create({ fullName, email, phone, password, cnic, status: 'pending' });
    const otp = generateOtp();
    await OtpVerification.create({
      userId: user._id,
      email,
      otp,
      purpose: 'signup',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    res.status(201).json({
      success: true,
      message: 'Signup successful. Verify OTP to activate.',
      data: { userId: user._id, otp }, // demo: return OTP (remove in production)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { userId, otp, purpose = 'signup' } = req.body;
    const record = await OtpVerification.findOne({
      userId,
      otp,
      purpose,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });
    if (!record) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });

    record.isUsed = true;
    await record.save();

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (purpose === 'signup') {
      user.isEmailVerified = true;
      user.status = 'active';
      await user.save();
      await Account.create({
        userId: user._id,
        accountNumber: generateAccountNumber(),
        accountType: 'savings',
        balance: 50000,
      });
      await Notification.create({
        userId: user._id,
        title: 'Welcome to Digital Banking',
        message: 'Your account has been activated with PKR 50,000 welcome balance.',
        type: 'system',
      });
    }

    const token = signToken(user._id, 'user');
    await createSession(token, user._id, null, req);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      message: 'OTP verified',
      data: { token, user: { id: user._id, fullName: user.fullName, email: user.email } },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (user.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Account suspended' });
    }
    if (user.status === 'pending') {
      return res.status(403).json({ success: false, message: 'Please verify OTP first' });
    }

    const token = signToken(user._id, 'user');
    await createSession(token, user._id, null, req);
    user.lastLogin = new Date();
    await user.save();

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          preferences: user.preferences,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const otp = generateOtp();
    await OtpVerification.create({
      userId: user._id,
      email,
      otp,
      purpose: 'reset_password',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    res.json({ success: true, message: 'OTP sent', data: { userId: user._id, otp } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const record = await OtpVerification.findOne({
      userId,
      otp,
      purpose: 'reset_password',
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });
    if (!record) return res.status(400).json({ success: false, message: 'Invalid OTP' });

    record.isUsed = true;
    await record.save();
    const user = await User.findById(userId);
    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = signToken(admin._id, 'admin');
    await createSession(token, null, admin._id, req);
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      data: {
        token,
        admin: { id: admin._id, fullName: admin.fullName, email: admin.email, role: admin.role },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    await Session.updateOne({ token: req.token }, { isActive: false });
    res.json({ success: true, message: 'Logged out' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
