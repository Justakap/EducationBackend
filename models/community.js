const mongoose = require("mongoose")
const communityScehma = new mongoose.Schema({
    name: String,
    member: {
        type: Array,
    },
    primeMember: {
        type: Array
    },
    image: String,
    dateCreated : {
        type: Date ,
        default : Date.now
    },
    description: String,
    tags : Array,
    category:String
})
const communityModel = mongoose.model("community", communityScehma);

module.exports = communityModel;