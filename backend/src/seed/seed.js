require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Admin = require('../models/Admin');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Card = require('../models/Card');
const Beneficiary = require('../models/Beneficiary');
const Notification = require('../models/Notification');
const generateAccountNumber = require('../utils/generateAccountNumber');

const seed = async () => {
  await connectDB();
  console.log('Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Admin.deleteMany({}),
    Account.deleteMany({}),
    Transaction.deleteMany({}),
    Card.deleteMany({}),
    Beneficiary.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const admin = await Admin.create({
    fullName: 'Super Admin',
    email: 'admin@bank.com',
    password: 'admin123',
    role: 'super_admin',
    permissions: ['all'],
  });

  const users = await User.create([
    {
      fullName: 'Shayan',
      email: 'shayan@email.com',
      phone: '03001234567',
      password: 'user123',
      cnic: '3520212345671',
      status: 'active',
      isEmailVerified: true,
    },
    {
      fullName: 'Sara Ali',
      email: 'sara@email.com',
      phone: '03007654321',
      password: 'user123',
      cnic: '3520298765432',
      status: 'active',
      isEmailVerified: true,
    },
    {
      fullName: 'Hassan Raza',
      email: 'hassan@email.com',
      phone: '03009876543',
      password: 'user123',
      cnic: '3520155566678',
      status: 'pending',
      isEmailVerified: false,
    },
  ]);

  const accounts = await Account.create([
    {
      userId: users[0]._id,
      accountNumber: generateAccountNumber(),
      balance: 250000,
      accountType: 'savings',
    },
    {
      userId: users[1]._id,
      accountNumber: generateAccountNumber(),
      balance: 180000,
      accountType: 'current',
    },
  ]);

  await Card.create([
    {
      userId: users[0]._id,
      accountId: accounts[0]._id,
      cardNumber: '4532 **** **** 7890',
      cardHolderName: 'SHAYAN',
      expiryMonth: 12,
      expiryYear: 2028,
      cvv: '123',
      spendingLimit: 150000,
      color: '#1a365d',
    },
  ]);

  await Beneficiary.create({
    userId: users[0]._id,
    nickname: 'Sara',
    accountNumber: accounts[1].accountNumber,
    accountHolderName: 'Sara Ali',
    isFavorite: true,
  });

  const ref1 = `TXN${Date.now()}001`;
  await Transaction.create({
    fromAccountId: accounts[0]._id,
    toAccountId: accounts[1]._id,
    fromUserId: users[0]._id,
    toUserId: users[1]._id,
    amount: 15000,
    type: 'transfer',
    status: 'completed',
    description: 'Monthly rent',
    reference: ref1,
    category: 'transfer',
  });

  await Notification.create([
    {
      userId: users[0]._id,
      title: 'Welcome',
      message: 'Your digital banking account is ready.',
      type: 'system',
    },
    {
      userId: users[0]._id,
      title: 'Transfer Successful',
      message: 'PKR 15,000 sent successfully.',
      type: 'transaction',
    },
  ]);

  console.log('\n✅ Seed completed!\n');
  console.log('Admin Login: admin@bank.com / admin123');
  console.log('User Login:  shayan@email.com / user123');
  console.log('User Login:  sara@email.com / user123');
  console.log(`Admin ID: ${admin._id}\n`);

  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
