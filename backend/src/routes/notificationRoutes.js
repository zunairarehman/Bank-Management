const express = require("express");
const router = express.Router();

const notificationController = require("../controllers/notificationController");
const { protectUser } = require("../middleware/auth");

router.use(protectUser);

router.get("/", notificationController.getNotifications);

router.put("/:id/read", notificationController.markAsRead);

module.exports = router;
