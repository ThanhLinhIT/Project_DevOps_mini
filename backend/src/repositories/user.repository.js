const User = require('../models/User');

const findByEmail  = (email) => User.findOne({ email });
const findById     = (id)    => User.findById(id).select('-password');
const findAll      = ()      => User.find().select('-password').sort({ createdAt: -1 });
const createUser   = (data)  => User.create(data);
const updateUser   = (id, data) => User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
const deleteUser   = (id)    => User.findByIdAndDelete(id);
const countUsers   = ()      => User.countDocuments();

module.exports = { findByEmail, findById, findAll, createUser, updateUser, deleteUser, countUsers };
