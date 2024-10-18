const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
const userSchema = new Schema({
     email:{type:String,unique:true},
    password:String,
     firstName:String,
     lastName:String
})
const adminSchema = new Schema({
    email:{type:String,unique:true},
    password:String,
    firstName:String,
    lastName:String
})
const courseSchema = new Schema({
    createrId:ObjectId,
    title:String,
    description:String,
    price:Number,
    imageUrl:String
});
const purchaseSchema = new Schema({
    courseId:ObjectId,
    userId:ObjectId
});

const userModel = mongoose.model("users",userSchema);
const adminModel =mongoose.model("admins",adminSchema);
const courseModel = mongoose.model("courses",courseSchema);
const purchaseModel = mongoose.model("purchases",purchaseSchema);
module.exports={
    userModel,adminModel,courseModel,purchaseModel
}
