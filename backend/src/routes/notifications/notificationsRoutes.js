const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} = require("../../controllers/notifications/notificationsController");

router.get(
  "/",
  authMiddleware,
  getNotifications
);

router.post(
  "/:id/read",
  authMiddleware,
  markNotificationRead
);

router.post(
  "/read-all",
  authMiddleware,
  markAllNotificationsRead
);

router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);

module.exports = router;
