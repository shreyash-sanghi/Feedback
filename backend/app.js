require("dotenv").config();
const express = require("express");
const app = express();
const port = 7000 || process.env.PORT;
const cors = require("cors");
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const Team = require("./src/model/Team")
const OtpData = require("./src/model/Otp")
const FeedbackMessage = require("./src/model/FeedbackMessage")
const auth = require("./src/mideal/auth")
const axios = require('axios');
const https= require("https");
const bcrypt = require('bcrypt');
app.use(cors({
    origin:"*",
    methods:["POST", "GET", "PATCH", "PUT", "DELETE"],
    credential:true
}))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin,);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, withCredentials');
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

function parseDateString(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}


app.post("/send_feedback/:id", async (req, res) => {
    const { Name, FeedbackTime, Number, Rating, Suggestions, FeedbackDate, TeamHelped } = req.body;
    const apiUrl = 'https://whatsbot.tech/api/send_sms';
    const apiToken = process.env.otp_api_token;
    const mobile = `91${Number}`;
    const message = `
Hi ${Name}

Thank you for taking the time to share your feedback with us! We truly value your input, as it helps us improve and serve you better.

Powered By :- Pay Click Online Services
    `;

    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    try {
        // Convert incoming FeedbackDate to a Date object
        const feedbackDateObject = parseDateString(FeedbackDate);
        // Check if the user has already submitted feedback this month
        const currentMonth = feedbackDateObject.getMonth();
        const currentYear = feedbackDateObject.getFullYear();

        const existingFeedback = await FeedbackMessage.findOne({
            Number,
            MonthDate: {
                $gte: new Date(currentYear, currentMonth, 1),
                $lt: new Date(currentYear, currentMonth + 1, 1)
            }
        });

        if (existingFeedback) {
            return res.status(400).json({ message: "You have already submitted feedback this month." });
        }

        const id = req.params.id;
        const result = await Team.findById(id);
        if (!result) {
            return res.status(404).json({ message: "Team member not found." });
        }

        await FeedbackMessage.create({
            Name,
            Number,
            Rating,
            Suggestions,
            MemberName: result.Name,
            MemberEmail: result.Email,
            FeedbackDate: FeedbackDate, // Save as a Date object
            MonthDate: feedbackDateObject,
            TeamHelped,
            FeedbackTime
        });

        // Send message to the user
        try {
            await axios.get(apiUrl, {
                params: {
                    api_token: apiToken,
                    mobile: mobile,
                    message: message
                },
                httpsAgent: agent
            });
        } catch (error) {
            console.error("Failed to send message to user:", error.message);
        }

        const teamNumber = `91${result.Number}`;
        const messageForTeam = `
Hi ${result.Name}

${Name} gave a rating of ${Rating} out of 10 and you helped in ${TeamHelped}. Their suggestion is: ${Suggestions}

Date: ${FeedbackDate}
        `;

        try {
            await axios.get(apiUrl, {
                params: {
                    api_token: apiToken,
                    mobile: teamNumber,
                    message: messageForTeam
                },
                httpsAgent: agent
            });
        } catch (error) {
            console.error("Failed to send message to team member:", error.message);
        }
        res.status(200).json({ message: "Feedback saved successfully." });
    } catch (error) {
        console.error("Error processing feedback:", error);
        res.status(500).json({ success: false, error: "Server error" });
    }
});


function parseDateString(dateString) {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
}




app.delete("/delete_feedback/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        await FeedbackMessage.findByIdAndDelete(id);
        res.sendStatus(202);
    } catch (error) {

        res.sendStatus(404);
    }
})  

app.delete("/delete_team_member/:id",async(req,res)=>{
    try {
        const id = req.params.id;
        await Team.findByIdAndDelete(id);
        res.sendStatus(202);
    } catch (error) {

        res.sendStatus(404);
    }
})  

app.post("/send_otp",async(req,res)=>{
   
        const {OTP,Number} = req.body;
        const apiUrl = 'https://whatsbot.tech/api/send_sms';
 const apiToken = process.env.otp_api_token; // Replace with your WhatsBot API key
 const mobile = `91${Number}`;
const message = `
Your One Time Password for Verification is ${OTP}

Powered By :- Pay Click Online Services
`;
    // Disable SSL certificate verification
    const agent = new https.Agent({
        rejectUnauthorized: false
    });
    try {
        const response = await axios.get(apiUrl, {
            params: {
              api_token: apiToken,  // API token from WhatsBot
              mobile: mobile,       // Customer's WhatsApp number
              message: message      // Message content
            },
            httpsAgent: agent  // Attach the https agent to disable SSL verification
          });
          res.sendStatus(202);

    } catch (error) {
        res.sendStatus(500);
    }
})  

app.post("/get_token",async(req,res)=>{
    try {
       const {Number,Name} = req.body;
              const response =  await OtpData.create({Name,Number});
          const token = jwt.sign({_id:response._id},process.env.SecretKey)
            res.status(202).json({token});
    } catch (error) {
        res.sendStatus(404);
    }
})  

app.post("/verify_key",async(req,res)=>{
    try {
        const key = req.body.key;
        const Email = req.body.Email;
        const data = await Team.findOne({Email});
        if(data == null && Email == process.env.Owner_Email){
            const password = await bcrypt.hash(key,10);
          const result =  await Team.create({Email,Key:password,Position:"Admin",Name:"Rohit Jain"});
                const Token = jwt.sign({_id:result._id},process.env.SecretKey);
                res.status(202).json({Token:Token,OwnerEmail:process.env.Owner_Email});
        }
        else{
            if(data == null ){
                res.status(404).json({error:"First create account..."})
            }
            else{
                const verify = await bcrypt.compare(key,data.Key);
                if(verify){
                    const Token = jwt.sign({_id:data._id},process.env.SecretKey);
                    console.log(data._id)
                    res.status(202).json({Token:Token,OwnerEmail:process.env.Owner_Email});
                }else{
                    res.status(404).json({error:"Enter correct id and code "});
                }
            }
        }
    } catch (error) {
console.log(error)
        res.status(404).json({error});
    }
}) 

app.post("/edit_team_member/:id",auth,async(req,res)=>{
    try {
        const id = req.params.id;
        const {Name,Number,Email,Profile}= req.body;

        if(Profile === undefined  ){
            const response = await Team.findOneAndUpdate({_id:id},{
                Name,Number,Email
            })
        }else{
            const response = await Team.findOneAndUpdate({_id:id},{
                Name,Number,Email,Profile
            })
        }
        res.sendStatus(202)
    } catch (error) {

        res.sendStatus(404);
    }
})  
app.post("/add_team",auth,async(req,res)=>{
    try {
        const {Name,Number,Email,Profile,Code}= req.body;
        const password = await bcrypt.hash(Code,10);
        await Team.create({Name,Number,Email,Profile,Key:password,Position:"Staf"});
        res.sendStatus(202)
    } catch (error) {

        res.sendStatus(404);
    }
})  
app.post("/update_team_account",auth,async(req,res)=>{
    try {
        const {Name,Number,Email,Profile}= req.body;
 
        const id = req.id;
        if(Profile== undefined){
            await Team.findOneAndUpdate({_id:id},{Name,Number,Email});
        }else{
            await Team.findOneAndUpdate({_id:id},{Name,Number,Email,Profile});
        }
        res.sendStatus(202)
    } catch (error) {

        res.sendStatus(404);
    }
})  
app.post("/update_password/:id",auth,async(req,res)=>{
    try {
        const {Password}= req.body;
        const id = req.params.id;
         const Key = await bcrypt.hash(Password,10);
            await Team.findOneAndUpdate({_id:id},{Key});
    
        res.sendStatus(202)
    } catch (error) {

        res.sendStatus(404);
    }
})  
app.post("/send_pasword_reset_link",async(req,res)=>{
    try {
        const {Email}= req.body;
         const result = await Team.findOne({Email});
         if(result == null || result == undefined){
            res.status(404).json({error:"No account is present.. "});
         }else{
            const token = jwt.sign({_id:result._id},process.env.SecretKey);
            const Link = `https://payclickfeedback.vercel.app/reset_password/${token}/${result._id}`;
            const apiUrl = 'https://whatsbot.tech/api/send_sms';
            const apiToken = process.env.otp_api_token; // Replace with your WhatsBot API key
            const mobile = `91${result.Number}`;
           const message = `
           Reset Password Link 
           ${Link}
           
           Powered By :- Pay Click Online Services
           `;
               // Disable SSL certificate verification
               const agent = new https.Agent({
                   rejectUnauthorized: false
               });
           
                   const response = await axios.get(apiUrl, {
                       params: {
                         api_token: apiToken,  // API token from WhatsBot
                         mobile: mobile,       // Customer's WhatsApp number
                         message: message      // Message content
                       },
                       httpsAgent: agent  // Attach the https agent to disable SSL verification
                     });
                     res.sendStatus(202);
    
        }
    } catch (error) {
        res.status(404).json({error:"They have some error due to bhich link have been not send..."});
    }
})  

app.get("/Check_token",auth,async(req,res)=>{
try {
    const id = req.id;
    const response = await OtpData.findById(id);
        res.status(202).json({response})
} catch (error) {
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
app.get("/get_Personal_feedback",auth,async(req,res)=>{
try {
    const id = req.id;
    const memberdata = await Team.findById(id);
    const response = await FeedbackMessage.find({MemberEmail:memberdata.Email});
        res.status(202).json({response})
} catch (error) {

    res.sendStatus(404);
}
})
app.get("/get_team",auth,async(req,res)=>{
try {
    const id = req.id;
    const data = await Team.findById(id);
    if(data.Email == process.env.Owner_Email){
        const response = await Team.find({Position : "Staf"});
        res.status(202).json({response})
    }else{
        res.sendStatus(401);
    }
} catch (error) {
    res.sendStatus(404);
}
})

app.get("/get_myaccount",auth,async(req,res)=>{
try {
    const id = req.id;
    const data = await Team.findById(id);
    console.log(data)
        res.status(202).json({response:data})
} catch (error) {
    res.sendStatus(404);
}
})

app.listen(port,()=>{
    console.log("Connect Successfully...")
})
