const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true
 },

 description:{
  type:String
 },

 // 🔥 NEW: Semester
 semester:{
  type:Number,
  required:true
 },

 // 🔥 NEW: Book / Material
 book:{
  type:String // can store PDF link or name
 },

 teacher:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 students:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"User"
  }
 ]

},{timestamps:true});

module.exports = mongoose.model("Course",CourseSchema);