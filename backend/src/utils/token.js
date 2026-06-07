const jwt = require('jsonwebtoken');

const signToken = (id, role = 'user') =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const getExpiryDate = () => {
  const days = parseInt(process.env.JWT_EXPIRES_IN, 10) || 7;
  const d = new Date();
  d.setDate(d.getDate() + (String(process.env.JWT_EXPIRES_IN).includes('d') ? days : 7));
  return d;
};

module.exports = { signToken, getExpiryDate };
