const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Session = require('../models/Session');

const protectUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ token, isActive: true, userId: decoded.id });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.status !== 'active') {
      return res.status(401).json({ success: false, message: 'Account not active' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ token, isActive: true, adminId: decoded.id });
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ success: false, message: 'Session expired' });
    }

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) {
      return res.status(401).json({ success: false, message: 'Admin not active' });
    }

    req.admin = admin;
    req.token = token;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.admin.role)) {
    return res.status(403).json({ success: false, message: 'Insufficient permissions' });
  }
  next();
};

module.exports = { protectUser, protectAdmin, requireRole };
