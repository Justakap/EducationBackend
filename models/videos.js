const mongoose = require('mongoose')
const vidSchema = new mongoose.Schema({
  branch: String,
  semester: String,
  subject: String,
  count: String,
  source: String,
  notesUrl: String,
  pyq: String,
  // other fields...
});

const vidModel = mongoose.model('videos', vidSchema);

module.exports = vidModel;

