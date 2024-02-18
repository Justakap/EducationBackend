const mongoose = require('mongoose')
const vidSchema = new mongoose.Schema({
  branch: String,
  semester: String,
  // count: String,
  subject: String,
  unit: Number,
  source: String,
  notesUrl: String,
  comment: String,
  review: Number,
  // other fields...
});

const vidModel = mongoose.model('videos', vidSchema);

module.exports = vidModel;

