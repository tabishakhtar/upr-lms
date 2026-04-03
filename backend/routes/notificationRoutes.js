const express = require("express");
const router = express.Router();

const {
 getNotifications,
 markAsRead
} = require("../controllers/notificationController");

// Get notifications
router.get("/notifications/:userId", getNotifications);

// Mark as read
router.put("/notification/:id", markAsRead);

module.exports = router;