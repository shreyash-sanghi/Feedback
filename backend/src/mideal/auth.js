const jwt = require("jsonwebtoken");

const addData = async (req,res,next)=>{
    try {
        const token = req.header('Authorization');
console.log("token",token)
        const varifyUser = jwt.verify(token,process.env.SecretKey);

        req.Token = token;
        req.id = varifyUser._id;
        next();
    } catch (error) {
        res.status(401).send("error"+error);
    }
}
module.exports = addData;
