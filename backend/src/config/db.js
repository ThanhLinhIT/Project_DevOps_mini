const mongoose = require('mongoose');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
  console.log('✅ MongoDB connected');
  await Promise.all([seedCourts(), seedAdmin()]);
};

const seedCourts = async () => {
  const Court = require('../models/Court');
  if ((await Court.countDocuments()) === 0) {
    await Court.insertMany([
      { name: 'Sân A', location: 'Khu vực 1 - Tầng trệt' },
      { name: 'Sân B', location: 'Khu vực 2 - Tầng trệt' },
      { name: 'Sân C', location: 'Khu vực 3 - Tầng 1' },
      { name: 'Sân D', location: 'Khu vực 4 - Tầng 1' },
    ]);
    console.log('🌱 Courts seeded (4 courts)');
  }
};

const seedAdmin = async () => {
  const User = require('../models/User');
  const exists = await User.findOne({ email: 'admin@gmail.com' });
  if (!exists) {
    await User.create({
      fullName: 'Administrator',
      email:    'admin@gmail.com',
      password: 'admin12345',
      role:     'admin',
      phone:    '0900000000',
    });
    console.log('🔐 Admin seeded: admin@gmail.com / admin12345');
  }
};

module.exports = connectDB;
