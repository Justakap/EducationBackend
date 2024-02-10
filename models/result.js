const mongoose = require('mongoose')
const resultSchema = new mongoose.Schema({
    marks: Number,
    name: String,
    AssesmentId: String,
    status: String,
});

const resultModel = mongoose.model('result', resultSchema);

module.exports = resultModel;