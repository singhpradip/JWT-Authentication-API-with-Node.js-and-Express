// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const tokenValidations = require("../middlewares/tokenValidations");
const {validateUserData} = require("../middlewares/validations");

router.post("/register", validateUserData, authController.register);
router.post("/verifyAccount", tokenValidations.verifyTempToken, validateUserData, authController.verifyAccount);
router.post("/resendOtp", tokenValidations.verifyTempToken, authController.resendOtp);
router.post("/login", authController.login);
router.get("/showInfo", tokenValidations.verifyToken, authController.showInfo);
router.put("/change-password", tokenValidations.verifyToken, authController.changePassword);
router.post("/forget-password", authController.forgrtPassword);
router.post("/forget-password/:token/:otp", tokenValidations.verifyTempTokenFromParams, tokenValidations.otpVerify, authController.setNewPassword); //validate newPassword if getting from body


module.exports = router;
