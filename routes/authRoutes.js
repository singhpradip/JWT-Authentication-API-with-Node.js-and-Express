// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middlewares/authMiddleware");
const { regValidate } = require("../middlewares/validations");

router.post("/register", regValidate, authController.register);
router.post("/login", authController.login);
router.get("/showInfo", verifyToken, authController.showInfo);

module.exports = router;
