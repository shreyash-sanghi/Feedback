const mongoose = require("mongoose");

const Events = new mongoose.Schema({
    Name:{type:String,required:true},
    Number:{type:Number,required:true},
    Rating:{type:String,required:true},
    Suggestions:{type:String},
    FeedbackDate:{type:String,required:true},
    MonthDate:{type:Date,required:true},
    TeamHelped:{type:String,required:true},
    MemberName:{type:String,required:true},
})
const Event = mongoose.model("FeedbackMessage",Events);  
module.exports = Event;