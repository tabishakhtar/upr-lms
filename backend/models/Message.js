const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({

 sender:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 receiver:{
  type: mongoose.Schema.Types.ObjectId,
  ref:"User"
 },

 text:{
  type:String
 },

 file:{
  type:String
 },

 seen:{
  type:Boolean,
  default:false
 }

},{timestamps:true});

module.exports = mongoose.model("Message", MessageSchema);