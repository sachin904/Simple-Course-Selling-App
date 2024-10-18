const {Router}= require("express");
const userRouter = Router();
const {z}=require("zod");
const {userModel,purchaseModel, courseModel}=require("../db");
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken");
const {userMiddleware}=require("../middleware/user");
const {USER_JWT_SECRET}=require("../config");


userRouter.post("/signup",async function(req,res){
    const requiredBody= z.object({
        email:z.string().min(3).max(100).email(),
        password:z.string().min(3).max(100),
        firstName:z.string().min(3).max(50),
        lastName:z.string().min(3).max(50)

    })
    const parseDataWithSucccess=requiredBody.safeParse(req.body);
    if(!parseDataWithSucccess.success){
        res.json({
            msg:"invalid format",
            err:parseDataWithSucccess.error

        })
      return  
    }
    const email=req.body.email;
    const password=req.body.password;
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    let errorThrown=false;
    try{
        const hashedPassword=await bcrypt.hash(password,5);
        console.log(hashedPassword);
       await userModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        });
       
    }
    catch(e){
             res.json({
                msg:"user already exists"
             })
             errorThrown=true;
    }
    if(!errorThrown){
           res.json({
            msg:"you are signed up"
        });
    }
    
});
userRouter.post("/login",async function(req,res){
    const email= req.body.email;
    const password=req.body.password;
    const user=await userModel.findOne({
        email:email
    });
    if(!user){
        res.status(403).json({
            msg:"invalid credential"
        });
        return
    }
    const passwordMatch= bcrypt.compare(password,user.password);
    if(passwordMatch){
        const token = jwt.sign({id:user._id.toString()},USER_JWT_SECRET);
        res.json({
            token:token
        })

    }
    else{
        res.status(403).json({
            msg:"invalid credential"
        });
    }

});
userRouter.get("/myCourse",userMiddleware,async function(req,res){
     const userId= req.userId;
     const purchases=await purchaseModel.find({
        userId
     })
     let purchaseCourseIds= [];
     for (let i=0;i<purchases.length;i++){
        purchaseCourseIds.push(purchases[i].courseId)
     }
     const coursesData = await courseModel.find({
        _id:{$in: purchaseCourseIds}
     })
     res.json({
         purchases,
         coursesData
    })
});


module.exports ={
    userRouter:userRouter
}