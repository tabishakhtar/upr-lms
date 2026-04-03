const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({

 student:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 course:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Course"
 },

 semester:Number, // 🔥 NEW

 marks:Number,
 grade:String,
 gpa:Number // 🔥 NEW

},{timestamps:true});

module.exports = mongoose.model("Result",ResultSchema);