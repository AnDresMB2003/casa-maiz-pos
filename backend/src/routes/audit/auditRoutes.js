const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const { getAudits } = require("../../controllers/audit/auditController");

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAudits
);

module.exports = router;
