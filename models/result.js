const mongoose = require('mongoose')
const resultSchema = new mongoose.Schema({
    name: String,
    marks: Number,
    AssesmentId: String,
    status: String,
});

const resultModel = mongoose.model('result', resultSchema);

module.exports = resultModel;