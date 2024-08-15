require("dotenv").config();
const express = require("express");
const app = express();
const port = 7000 || process.env.PORT;
const cors = require("cors");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const Team = require("./src/model/Team")
const FeedbackMessage = require("./src/model/FeedbackMessage")
const auth = require("./src/mideal/auth")
app.use(cors({
    origin:"http://localhost:5174",
    methods:["POST", "GET", "PATCH", "PUT", "DELETE"],
    credential:true
}))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "http://localhost:5174",);
    res.header('Access-Control-Allow-Credentials', "true");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
   
  mongoose.connect(process.env.Connect_Url)
  .then(()=>{
      console.log("Data base have been connected...")
  })

  app.get("/",(req,res)=>{
    res.send("Hello My name is shreyash jain ");
})
app.post("/send_feedback/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        const {Name,Number,Rating,Suggestions} = req.body;
        const result = await Team.findById(id);
        const response = await FeedbackMessage.create({
            Name,Number,Rating,Suggestions,MemberName:result.Name
        })
        res.sendStatus(202);
    } catch (error) {
        res.sendStatus(404);
    }
})  
app.delete("/delete_feedback/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        await FeedbackMessage.findByIdAndDelete(id);
        res.sendStatus(202);
    } catch (error) {
        console.log(error)
        res.sendStatus(404);
    }
})  
app.delete("/delete_team_member/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        await Team.findByIdAndDelete(id);
        res.sendStatus(202);
    } catch (error) {
        console.log(error)
        res.sendStatus(404);
    }
})  

app.post("/verify_key",(req,res)=>{
    try {
        const key = req.body.key;
        console.log(key)
        if(key == process.env.key){
            const Token = jwt.sign({_id:1},process.env.SectetKey);
            res.status(202).json({Token:Token});
        }
        else{
            res.sendStatus(404);
        }
    } catch (error) {
        res.sendStatus(404);
    }
})  
app.post("/add_team",auth,async(req,res)=>{
    try {
        const {Name,Number,Email}= req.body;
        console.log(Name,Number,Email)
        const response = await Team.create({Name,Number,Email});
        res.sendStatus(202)
    } catch (error) {
        console.log(error)
        res.sendStatus(404);
    }
})  

app.get("/get_feedback",auth,async(req,res)=>{
try {
    const response = await FeedbackMessage.find();
   
        res.status(202).json({response})
} catch (error) {
    res.sendStatus(404);
}
})
app.get("/get_team",auth,async(req,res)=>{
try {
    const response = await Team.find();
        res.status(202).json({response})
} catch (error) {
    res.sendStatus(404);
}
})

app.listen(port,()=>{
    console.log("Connect Successfully...")
})