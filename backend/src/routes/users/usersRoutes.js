const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetPassword,
  changePassword,
  getUserActivity,
} = require(
  "../../controllers/users/usersController"
);

const authMiddleware =
  require("../../middleware/authMiddleware");

const roleMiddleware =
  require("../../middleware/roleMiddleware");

// GET USERS
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  getUsers
);

// CREATE USER
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  createUser
);

// UPDATE USER
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUser
);

// TOGGLE ACTIVE STATUS
router.patch(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  toggleUserStatus
);

// RESET PASSWORD
router.post(
  "/:id/reset-password",
  authMiddleware,
  roleMiddleware(["admin"]),
  resetPassword
);

// CHANGE PASSWORD
router.post(
  "/:id/change-password",
  authMiddleware,
  changePassword
);

// USER ACTIVITY
router.get(
  "/:id/activity",
  authMiddleware,
  roleMiddleware(["admin"]),
  getUserActivity
);

// DELETE USER
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  deleteUser
);

module.exports = router;