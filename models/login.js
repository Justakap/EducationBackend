
const mongoose = require('mongoose')
const loginSchema = new mongoose.Schema({
 
  email: String,
 
  password: String,
  
  // other fields...
});

const loginModel = mongoose.model('login', loginSchema);

module.exports = loginModel;