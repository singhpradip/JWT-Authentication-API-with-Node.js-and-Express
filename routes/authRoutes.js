const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const tokenValidations = require("../middlewares/tokenValidations");
const { validateUserData } = require("../middlewares/validations");
// const {sendVerificationEmail} = require('../utils/email')

router.post("/register", validateUserData, authController.register);
router.post(
  "/register/resendOtp",
  tokenValidations.verifyTempToken,
  authController.resendAccountVerificationOtp
);
router.post(
  "/register/verify-account",
  tokenValidations.verifyTempToken,
  validateUserData,
  authController.verifyAccount
);
router.post("/login", authController.login);
router.get("/showInfo", tokenValidations.verifyToken, authController.showInfo);
router.put(
  "/change-password",
  tokenValidations.verifyToken,
  authController.changePassword
);

// when user forgot their password
router.post("/forget-password", authController.forgetPassword);
router.post(
  "/forget-password/resendOtp",
  tokenValidations.verifyTempToken,
  authController.resendPasswordResetOtp
);
router.post(
  "/forget-password/verifyOtp",
  validateUserData,
  tokenValidations.verifyTempToken,
  tokenValidations.otpVerify,
  (req, res) => {
    res.status(200).json({ message: "OTP verified successfully." });
  }
);
router.post(
  "/forget-password/resetPassword",
  validateUserData,
  tokenValidations.verifyTempToken,
  tokenValidations.otpVerify,
  authController.setNewPassword
);

// verify if user is logged in
router.post("/verify-token", tokenValidations.verifyToken, (req, res) => {
  res.status(200).json({ message: "Token is valid", data: req.body });
});

// router.post("/google",  );

// router.post("/test", sendVerificationEmail);

router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

module.exports = router;
