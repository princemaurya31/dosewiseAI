// const jwt =require("jsonwebtoken")
// const protect = (req,res,next)=>{
//   const token =req.headers.authorization;
//   if(!token){
//     return res.status(401).json("login required")
//   }
//   try{
//     const decoded = jwt.verify(token,process.env.JWT_SECRET)
//     req.user=decoded;
//     next();

//   }
//   catch(error){
//     res.status(401).json({message:"invalid token"});

//   }
// }
// module.exports=protect



const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            console.log("TOKEN RECEIVED:", token); // 🔹 log token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            console.log("USER AUTHORIZED:", req.user.email); // 🔹 log user email
            next();
        } catch (error) {
            console.log("TOKEN ERROR:", error.message);
            res.status(401).json({ message: "Not authorized, token failed" });
        }
    } else {
        console.log("NO TOKEN FOUND IN HEADERS");
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
module.exports = protect;