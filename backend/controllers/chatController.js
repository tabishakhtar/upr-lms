const Message = require("../models/Message");
const User = require("../models/User");

// 🔥 SEND MESSAGE (TEXT + FILE)
exports.sendMessage = async (req, res) => {
 try {

  const { sender, receiver, text } = req.body;

  const file = req.file ? req.file.path : null;

  const msg = new Message({
   sender,
   receiver,
   text,
   file,
   seen: false
  });

  await msg.save();

  // 🔥 real-time emit
  if (global.io) {
   global.io.emit("newMessage", msg);
  }

  res.json(msg);

 } catch (err) {
  console.log(err);
  res.status(500).json(err);
 }
};


// 🔥 GET CHAT HISTORY
exports.getMessages = async (req, res) => {
 try {

  const { sender, receiver } = req.query;

  const msgs = await Message.find({
   $or: [
    { sender, receiver },
    { sender: receiver, receiver: sender }
   ]
  }).sort({ createdAt: 1 });

  res.json(msgs);

 } catch (err) {
  res.status(500).json(err);
 }
};


// 🔥 GET ALL USERS (USER LIST)
exports.getUsers = async (req, res) => {
 try {

  const { userId } = req.params;

  if (!userId) {
   return res.status(400).json({ message: "User ID missing" });
  }

  const users = await User.find({
   _id: { $ne: userId }
  }).select("name email role");

  res.json(users);

 } catch (err) {
  console.log("GET USERS ERROR:", err);  // 🔥 IMPORTANT
  res.status(500).json({ message: "Server Error" });
 }
};


// 🔥 MARK MESSAGES AS SEEN ✔✔
exports.markSeen = async (req, res) => {
 try {

  const { sender, receiver } = req.body;

  await Message.updateMany(
   {
    sender,
    receiver,
    seen: false
   },
   {
    seen: true
   }
  );

  res.json({ message: "Messages marked as seen" });

 } catch (err) {
  res.status(500).json(err);
 }
};