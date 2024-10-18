const express= require("express");
require('dotenv').config();

const {courseRouter} = require("./routes/course");
const {userRouter} = require("./routes/user")
const {adminRouter} =require("./routes/admin")


const mongoose=require("mongoose");

const app=express();
app.use(express.json());

app.use("/course",courseRouter);
app.use("/user",userRouter);
app.use("/admin",adminRouter);

async function main(){
   await mongoose.connect(process.env.MONGO_URL);
   app.listen(3001);
   console.log("listenning on port 3000");
}
main();
