const express =require("express");
const Router = express.Router;
const app=express();
const {userMiddleware}=require("../middleware/user");
const courseRouter = Router();
app.use(express.json());
const {purchaseModel,courseModel}= require("../db");
courseRouter.post("/purchase",userMiddleware,async function(req,res){
    const userId=req.userId;
    const courseId=req.body.courseId;
    await purchaseModel.create({
        userId,
        courseId
    })
    res.json({
        msg:"you have successfully bought the course",
       
    })
});
courseRouter.get("/preview",async function(req,res){
const courses= await courseModel.find({});
    res.json({
       courses
    })
});
module.exports ={

    courseRouter:courseRouter
}