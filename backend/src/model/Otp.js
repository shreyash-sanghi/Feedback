const mongoose = require("mongoose");

const Teams = new mongoose.Schema({
    Name:{type:String,required:true},
    Number:{type:Number,required:true},
})
const Team = mongoose.model("OTP_DATA",Teams);  
module.exports = Team;