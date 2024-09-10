const mongoose = require("mongoose");

const Teams = new mongoose.Schema({
    Name:{type:String,required:true},
    Email:{type:String,required:true,unique:true},
    Number:{type:Number,unique:true},
    Profile:{type:String},
    Position:{type:String,required:true},
    Key:{type:String,required:true},
})
const Team = mongoose.model("Team",Teams);  
module.exports = Team;