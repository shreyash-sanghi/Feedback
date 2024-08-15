const jwt = require("jsonwebtoken");

const addData = async (req,res,next)=>{
    try {
        const token = req.header('Authorization');
        const varifyUser = jwt.verify(token,process.env.SectetKey);
        req.Token = token;
        next();
    } catch (error) {
        res.status(401).send("error"+error);
    }
}
module.exports = addData;