const mongoose = require('mongoose')
const communityMessageSchema = new mongoose.Schema({
    author: String,
    message: String,
    communityCell: String,
    sentTime: {
        type: Date,
        default: Date.now
    },  
});

const communityMessageModel = mongoose.model('communityMessage', communityMessageSchema);

module.exports = communityMessageModel;