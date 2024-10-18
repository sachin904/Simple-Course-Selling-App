const {USER_JWT_SECRET}= require("../config");
const jwt = require("jsonwebtoken");


/*function middleware(password){
    return function(req,res,next){
        const token =req.headers.token;
    const decode=jwt.verify(token,USER_JWT_SECRET);
    if(decode){
        req.userId=decode.id;
        next();
    }
    else{
        res.json("you are not signed in");
    }
 }
}*/
function userMiddleware(req,res,next){
    const token =req.headers.token;
    const decode=jwt.verify(token,USER_JWT_SECRET);
    if(decode){
        req.userId=decode.id;
        next();
    }
    else{
        res.json("you are not signed in");
    }
}
module.exports={
    userMiddleware:userMiddleware
}