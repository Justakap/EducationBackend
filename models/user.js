
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: Number,
  password: String,
  branch: String,
  year: String,
  
  // other fields...
});

const UserModel = mongoose.model('users', userSchema);

module.exports = UserModel;