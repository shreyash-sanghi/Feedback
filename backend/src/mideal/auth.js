const jwt = require("jsonwebtoken");

const addData = async (req,res,next)=>{
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) throw new Error("Authorization header missing");
        
        const token = authHeader.split(" ")[0]; // Assuming "Bearer <token>"
        if (!token) throw new Error("Token not provided");
const varifyUser = jwt.verify(token,process.env.SecretKey);
        req.Token = token;
        req.id = varifyUser._id;
        next();
    } catch (error) {
        res.status(401).send("error"+error);
    }
}
module.exports = addData;
