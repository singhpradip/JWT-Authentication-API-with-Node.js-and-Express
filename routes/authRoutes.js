// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
  verifyToken,
  verifyTempToken,
  verifyTempTokenFromParams,
  otpVerify
} = require("../middlewares/tokenValidations");
const { regValidate, otpValidate } = require("../middlewares/validations");

router.post("/register", regValidate, authController.register);
router.post("/verifyAccount",
  verifyTempToken,
  otpValidate,
  authController.verifyAccount
);
router.post("/resendOtp", verifyTempToken, authController.resendOtp);
router.post("/login", authController.login);
router.get("/showInfo", verifyToken, authController.showInfo);
router.put("/change-password", verifyToken, authController.changePassword);
router.post("/forget-password", authController.forgrtPassword);
router.post("/forget-password/:token/:otp", verifyTempTokenFromParams, otpVerify, authController.setNewPassword); //validate newPassword if geting from body


module.exports = router;
