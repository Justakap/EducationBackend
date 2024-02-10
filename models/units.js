const mongoose = require('mongoose')

const unitSchema = new mongoose.Schema({
    subject: String,
    unit: [{
        number: Number,
        name: String,
        totalVideos: Number,
        totalUnits: Number,
    }]
});

const unitModel = mongoose.model('unit', unitSchema);

module.exports = unitModel;
