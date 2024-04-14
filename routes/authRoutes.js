// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const tokenValidations = require("../middlewares/tokenValidations");
const {validateUserData} = require("../middlewares/validations");

router.post("/register", validateUserData, authController.register);
router.post("/register/verify-account", tokenValidations.verifyTempToken, validateUserData, authController.verifyAccount);
router.post("/resendOtp", tokenValidations.verifyTempToken, authController.resendOtp);
router.post("/login", authController.login);
router.get("/showInfo", tokenValidations.verifyToken, authController.showInfo);
router.put("/change-password", tokenValidations.verifyToken, authController.changePassword);
router.post("/forget-password", authController.forgrtPassword);
router.post("/forget-password/verify", validateUserData, tokenValidations.verifyTempToken, tokenValidations.otpVerify, authController.setNewPassword); //validate newPassword if getting from body

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = router;
