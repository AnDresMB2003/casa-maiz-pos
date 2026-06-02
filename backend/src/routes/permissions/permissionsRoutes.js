const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");
const roleMiddleware = require("../../middleware/roleMiddleware");
const {
  getRolePermissions,
  saveRolePermissions,
} = require("../../controllers/permissions/permissionsController");

router.get(
  "/:role",
  authMiddleware,
  roleMiddleware(["admin"]),
  getRolePermissions
);

router.put(
  "/:role",
  authMiddleware,
  roleMiddleware(["admin"]),
  saveRolePermissions
);

module.exports = router;
