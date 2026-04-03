const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({

 title:{
  type:String,
  required:true
 },

 // ✅ OLD FIELD (KEEP FOR BACKWARD COMPATIBILITY)
 content:{
  type:String   // link (pdf/video)
 },

 // ✅ NEW FIELD (FOR FILE UPLOAD)
 fileUrl:{
  type:String
 },

 // ✅ NEW FIELD (BOOK SUPPORT)
 book:{
  type:String
 },

 course:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Course",
  required:true
 },

 teacher:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 }

},{timestamps:true});

module.exports = mongoose.model("Lecture",LectureSchema);