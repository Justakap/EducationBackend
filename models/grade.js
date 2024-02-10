const mongoose = require("mongoose")
const gradeScehma = new mongoose.Schema({
    grade: String,
    value: Number,
})
const gradeModel = mongoose.model("grade", gradeScehma);

module.exports = gradeModel;