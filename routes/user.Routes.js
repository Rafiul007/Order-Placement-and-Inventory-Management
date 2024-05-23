const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// POST route to create a super admin
router.post("/superAdmin", userController.createSuperAdmin);
router.post("/registration", userController.registerUser);
router.post("/login", userController.loginUser);
module.exports = router;
