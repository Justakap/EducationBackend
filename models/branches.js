const mongoose = require('mongoose')
const branchSchema = new mongoose.Schema({
  branch: String,
  image: String,
});

const branchModel = mongoose.model('branch', branchSchema);

module.exports = branchModel;