const {ADMIN_JWT_SECRET}=require("../config");
const jwt=require("jsonwebtoken");
const admin = require("../routes/admin");

function adminMiddleware(req,res,next){
    const token=req.headers.token;
    const decode=jwt.verify(token,ADMIN_JWT_SECRET);
    if(decode){
         req.adminId=decode.id; 
         next();
    }
    else{
        res.json({
            msg:"you are not logged in"
        })
    }
}
module.exports ={
    adminMiddleware:adminMiddleware
}