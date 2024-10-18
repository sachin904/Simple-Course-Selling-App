const {Router}= require("express");
const bcrypt =require("bcrypt");
const {adminMiddleware}=require("../middleware/admin")
const jwt=require("jsonwebtoken");
const {z}=require("zod")
const {ADMIN_JWT_SECRET}=require("../config");
const adminRouter =Router();
const {adminModel, courseModel}=require("../db");
adminRouter.post("/signup",async function(req,res){
    const requiredBody=z.object({
      email:z.string().min(3).max(100).email(),
      password:z.string().min(3).max(100),
      firstName:z.string().min(3).max(50),
      lastName:z.string().min(3).max(50)
     })
     const parseDataWithSucccess = requiredBody.safeParse(req.body);
     if(!parseDataWithSucccess.success){
        res.json({
            msg:"incorrect format",
            error:parseDataWithSucccess.error
        })
        return
     }
     const email =req.body.email;
     const password=req.body.password;
     const firstName=req.body.firstName;
     const lastName=req.body.lastName;
     let errorThrown=false;
     try{
        const hashedPassword=await  bcrypt.hash(password,5);
        console.log(hashedPassword);
        await adminModel.create({
            email:email,
            password:hashedPassword,
            firstName:firstName,
            lastName:lastName
        });
     }
   catch(e){
       res.json({
        msg:"user already exist"
       })
       errorThrown=true;
   }  
   if(!errorThrown){
    res.json({
        msg:"you are signed up"
    });
   }


});
adminRouter.post("/login",async function(req,res){
    const email=req.body.email;
    const password=req.body.password;
    const admin=await adminModel.findOne({
        email:email
    });
    if(!admin){
        res.status(403).json({
            msg:"invalid credentials"
        });
        return
    }
   const passwordMatch =await  bcrypt.compare(password,admin.password);
   if(passwordMatch){
       const token=  jwt.sign({id:admin._id.toString()},ADMIN_JWT_SECRET);
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
adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId=req.adminId;
    const {title,description,price,imageUrl}=req.body;
   const course= await courseModel.create({
        createrId:adminId,
        title:title,
        description:description,
        price:price,
        imageUrl:imageUrl
    })

    res.json({
       msg:"course created",
       courseId:course._id
    })
});
adminRouter.put("/course", adminMiddleware, async function (req, res) {
    const adminId = req.adminId;
    const { title, description, price, imageUrl, courseId } = req.body; // Change `creatorId` to `courseId`

    const course = await courseModel.updateOne(
        { _id: courseId, createrId: adminId }, // Use `courseId` for the course, and `adminId` to ensure ownership
        {
            title: title,
            description: description,
            price: price,
            imageUrl: imageUrl,
        }
    );

    if (course.nModified === 0) {
        return res.status(404).json({ msg: "Course not found or no changes made" });
    }

    res.json({
        msg: "Course updated",
        courseId: courseId,
    });
});
adminRouter.get("/courseBulk",adminMiddleware,async function(req,res){
         const adminId=req.adminId;
         const courses= await courseModel.find({
                createrId:adminId
         })
         res.json({
            msg:"here are your courses",
            courses
        })
         
});


module.exports ={
    adminRouter:adminRouter
}