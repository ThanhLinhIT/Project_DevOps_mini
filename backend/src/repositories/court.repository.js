const Court = require('../models/Court');

const findAll    = ()        => Court.find().sort({ name: 1 });
const findById   = (id)      => Court.findById(id);
const create     = (data)    => Court.create(data);
const update     = (id, data) => Court.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const deleteById = (id)      => Court.findByIdAndDelete(id);
const countAll   = ()        => Court.countDocuments();

module.exports = { findAll, findById, create, update, deleteById, countAll };
