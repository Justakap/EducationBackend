const mongoose = require('mongoose')
const subjectSchema = new mongoose.Schema({
    name: String,
    semester: Number,
    image: String,
    branch: String,

});

const subjectModel = mongoose.model('subjects', subjectSchema);

module.exports = subjectModel;