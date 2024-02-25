const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true // Ensure name is required
  },
  email: {
    type: String,
    required: true, // Ensure email is required
    unique: true // Ensure email is unique
  },
  contact: {
    type: String,
    required: true // Ensure contact is required
  },
  password: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    // required: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isCollege: {
    type: Boolean,
    default: false
  },
  isPlus: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,

  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
