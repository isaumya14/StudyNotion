const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    reuired: true,
    trim: true,
  },
  lastname: {
    type: String,
    reuired: true,
    trim: true,
  },
  email: {
    type: String,
    reuired: true,
    trim: true,
  },
  password: {
    type: String,
    reuired: true,
  },
  accountType: {
    type: String,
    reuired: true,
    enum: ["Admin", "Student", "Instructor"],
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  courses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  }],
  image: {
    type: String,
    reuired: true,
  },
  token:{
    type:String,
  },
  resetPasswordExpires:{
    type:Date,
  },
  courseProgress:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "courseProgress",
  }],
});
module.exports=mongoose.model("User",userSchema);