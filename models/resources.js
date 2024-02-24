const mongoose = require('mongoose')
const resourceSchema = new mongoose.Schema({

    name: String,
    image: String,
    to: String,
});

const resourceModel = mongoose.model('resource', resourceSchema);

module.exports = resourceModel;