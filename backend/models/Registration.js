const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema({

 student:{
  type:mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 semester:{
  type:Number,
  required:true
 },

 courses:[
  {
   type:mongoose.Schema.Types.ObjectId,
   ref:"Course"
  }
 ],

 status:{
  type:String,
  enum:["pending","approved","rejected"],
  default:"pending"
 }

},{timestamps:true});

module.exports = mongoose.model("Registration",RegistrationSchema);