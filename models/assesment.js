const mongoose = require("mongoose")
const assesmentScehma = new mongoose.Schema({
    subject: String,
    number: Number,
    TotalQuestion: Number,
})
const assesmentModel = mongoose.model("assesment", assesmentScehma);

module.exports = assesmentModel;