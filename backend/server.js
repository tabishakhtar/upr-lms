const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

// ================= APP =================
const app = express();

// ================= MIDDLEWARE =================
app.use(cors({
 origin: "http://localhost:3000",
 credentials: true
}));

app.use(express.json());

// 🔥 Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= ROUTES =================
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const studentRoutes = require("./routes/studentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatRoutes = require("./routes/chatRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api", notificationRoutes);
app.use("/api/chat", chatRoutes);

// ================= TEST =================
app.get("/", (req, res) => {
  res.send("UPR LMS API Running");
});

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
 cors: {
  origin: "http://localhost:3000",
  methods: ["GET", "POST"]
 }
});

global.io = io;

// 🔥 STORE ONLINE USERS
const onlineUsers = {};

io.on("connection", (socket) => {

 console.log("User connected:", socket.id);

 // ✅ USER JOINS (IMPORTANT)
 socket.on("join", (userId) => {

  onlineUsers[userId] = socket.id;

  // broadcast updated online users
  io.emit("onlineUsers", Object.keys(onlineUsers));

 });

 // 🔥 TYPING (SEND TO SPECIFIC USER)
 socket.on("typing", (data) => {

  const receiverSocket = onlineUsers[data.receiver];

  if (receiverSocket) {
   socket.to(receiverSocket).emit("typing", data);
  }

 });

 // 🔥 DISCONNECT
 socket.on("disconnect", () => {

  console.log("User disconnected:", socket.id);

  let disconnectedUser = null;

  for (let userId in onlineUsers) {
   if (onlineUsers[userId] === socket.id) {
    disconnectedUser = userId;
    delete onlineUsers[userId];
    break;
   }
  }

  // broadcast updated online users
  io.emit("onlineUsers", Object.keys(onlineUsers));

 });

});

// ================= DB + START =================
mongoose.connect(process.env.MONGO_URI)
.then(() => {
 console.log("MongoDB Connected ✅");

 const PORT = process.env.PORT || 5000;

 server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 });
})
.catch((err) => console.log(err));