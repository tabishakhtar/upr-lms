const Notification = require("../models/Notification");

// 🔥 GET NOTIFICATIONS
exports.getNotifications = async (req,res)=>{

 try{

  const {userId} = req.params;

  const notifications = await Notification.find({
   user:userId
  }).sort({createdAt:-1});

  res.json(notifications);

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }

};


// 🔥 MARK AS READ
exports.markAsRead = async (req,res)=>{

 try{

  const {id} = req.params;

  const updated = await Notification.findByIdAndUpdate(
   id,
   {read:true},
   {new:true}
  );

  res.json(updated);

 }catch(err){
  console.log(err);
  res.status(500).json(err);
 }

};