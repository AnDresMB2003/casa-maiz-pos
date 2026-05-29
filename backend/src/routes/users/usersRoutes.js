const express = require("express");

const router = express.Router();

const {
  getUsers,
  createUser,
  deleteUser,
} = require(
  "../../controllers/users/usersController"
);

const authMiddleware =
  require("../../middleware/authMiddleware");

// GET USERS
router.get(
  "/",
  authMiddleware,
  getUsers
);

// CREATE USER
router.post(
  "/",
  authMiddleware,
  createUser
);

// DELETE USER
router.delete(
  "/:id",
  authMiddleware,
  deleteUser
);

module.exports = router;