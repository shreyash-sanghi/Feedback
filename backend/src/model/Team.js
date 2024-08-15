const mongoose = require("mongoose");

const Teams = new mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String,required:true,unique:true},
    Number:{type:Number,required:true},
})
const Team = mongoose.model("Team",Teams);  
module.exports = Team;