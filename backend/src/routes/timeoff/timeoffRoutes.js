const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const {
  listTimeOff,
  createTimeOff,
  updateTimeOff,
  deleteTimeOff,
} = require("../../controllers/timeoff/timeoffController");

router.get(
  "/",
  authMiddleware,
  listTimeOff
);

router.post(
  "/",
  authMiddleware,
  createTimeOff
);

router.put(
  "/:id",
  authMiddleware,
  updateTimeOff
);

router.delete(
  "/:id",
  authMiddleware,
  deleteTimeOff
);

module.exports = router;
