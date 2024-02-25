const mongoose = require('mongoose');

const inboxSchema = new mongoose.Schema({
    email: String,
    subject: String,
    message: String,
    time: {
        type: Date,
        default: Date.now
    },
    displayed: {
        type: Boolean,
        default: false
    }
});

const inboxModel = mongoose.model('inbox', inboxSchema);

module.exports = inboxModel;
