const mongoose = require('mongoose')
const questionSchema = new mongoose.Schema({
    AssesmentId: String,
    question: String,
    opt1: String,
    opt2: String,
    opt3: String,
    opt4: String,
    ans: Number,
});

const questionModel = mongoose.model('questions', questionSchema);

module.exports = questionModel;