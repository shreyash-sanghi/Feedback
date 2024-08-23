const mongoose = require("mongoose");

const Events = new mongoose.Schema({
    Name:{type:String,required:true},
    Month:{type:String,required:true},
    Coin:{type:String,required:true},
    Pay:{type:Boolean,required:true},
})
const Event = mongoose.model("FeedbackMessage",Events);  
module.exports = Event;