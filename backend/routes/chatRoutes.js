const express = require("express");
const router = express.Router();

const {
 sendMessage,
 getMessages,
 getUsers,
 markSeen
} = require("../controllers/chatController");

const upload = require("../middleware/upload");

// send message (file support)
router.post("/send-message", upload.single("file"), sendMessage);

// chat history
router.get("/messages", getMessages);

// user list
router.get("/users/:userId", getUsers);

// seen ✔✔
router.post("/seen", markSeen);

module.exports = router;