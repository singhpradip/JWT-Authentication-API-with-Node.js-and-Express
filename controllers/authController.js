const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { secretKey, expiresIn, OTPexpiresIn } = require("../config/jwt");
const { generateOTP } = require("../utils/generateOTP");
const { sendVerificationEmail } = require("../utils/sendEmail");
const { successResponse, errorResponse } = require("../utils/response");

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, tokenVersion: user.tokenVersion },
    secretKey,
    { expiresIn }
  );
};
const generateTempToken = (email) => {
  return jwt.sign({ email: email }, secretKey, {
    expiresIn: OTPexpiresIn,
  });
};
const sendOtp = async (username, email) => {
  try {
    generateTempToken(email);
    const otp = generateOTP();
    await sendVerificationEmail(username, email, otp);

    const tempToken = generateTempToken(email);
    // console.log({ OTP: otp, Token: tempToken });
    // console.log("OTP sent successfully to:", email);
    return { tempToken, otp };
  } catch (error) {
    console.error("Failed to send OTP:", error);
    throw new Error("Failed to send OTP");
  }
};
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json(
          errorResponse(
            "User already registered, Proceed to login or use new email"
          )
        );
    }
    // console.log (existingUser);

    const { tempToken, otp } = await sendOtp(username, email);
    // console.log (otp);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { username, password: hashedPassword, otp },
      { new: true, upsert: true }
    );
    // console.log (user);
    if (!user) {
      return res.status(500).json({ message: "Failed to register user" });
    }

    const verificationUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/verify-account?tempToken=${tempToken}`;
    console.log({
      Message: "OTP sent Successfuly!",
    });
    res.status(201).json(
      successResponse("Verify account using OTP sent to your email", {
        verificationUrl,
      })
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(errorResponse("Internal server error"));
  }
};
const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json(
          successResponse(
            "User already registered, Proceed to login or use new email"
          )
        );
    }
    if (user.otp !== otp) {
      return res.status(400).json(errorResponse("Invalid OTP, not matched"));
    }

    user.isVerified = true;
    user.otp = "";
    await user.save();

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);
    return res
      .status(200)
      .json(successResponse("User logged in successfully", { user, token }));
  } catch (error) {
    console.error(error);
    res.status(400).json(errorResponse(error.message));
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }
    if (user.isVerified) {
      return res
        .status(400)
        .json(successResponse("Your account is already verified"));
    }

    const { tempToken, otp } = await sendOtp(email);

    user.otp = otp;
    await user.save();

    console.log({
      Message: "OTP Resent Successfuly!",
      newTempToken: tempToken,
      OTP: otp,
    });

    return res
      .status(200)
      .json(
        successResponse("OTP Resent Successfully", { newTempToken: tempToken })
      );
  } catch (error) {
    console.error(error);
    res.status(400).json(errorResponse(error.message));
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json(errorResponse("Invalid password"));
    }
    if (!user.isVerified) {
      console.log(
        "User is not verified\nTODO: redirect user to the OTP Verification page with email payload"
      );
      return res
        .status(403)
        .json(
          errorResponse("Your account is not verified, Please verify first !")
        );
    }
    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);
    res.json(successResponse("User logged in successfully", { user, token }));
  } catch (error) {
    res.status(400).json(errorResponse(error.message));
  }
};
const showInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    res.json(successResponse("User data retrieved successfully", { user }));
  } catch (error) {
    res.status(500).json(errorResponse(error.message));
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json(errorResponse("Current password is incorrect"));
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    res.status(200).json(successResponse("Password changed successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
};
const forgrtPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }

    const { tempToken, otp } = await sendOtp(email);

    user.otp = otp;
    await user.save();

    const verificationUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/verify?tempToken=${tempToken}`;

    console.log({
      Message: "OTP sent Successfuly!",
      verificationUrl: verificationUrl,
      OTP: otp,
    });

    return res
      .status(200)
      .json(successResponse("OTP sent Successfully!", { verificationUrl }));
  } catch (error) {
    console.error(error);
    res.status(400).json(errorResponse(error.message));
  }
};
const setNewPassword = async (req, res) => {
  try {
    //Receive new password from body or anywhere, see it while implemnting frontend
    // for now lets get new password through req.body
    const { user, newPassword } = req.body;

    // TODO: Impliment params instead of req.body whenevr needed**** IMP
    // in verifyAccount, resendOtp

    if (!user.isVerified) {
      console.log(
        "User is not verified\nTODO: redirect user to the OTP Verification page with email payload"
      );
      return res
        .status(403)
        .json(
          errorResponse("Your account is not verified, Please veify first !")
        );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    // console.log("This is SetPassword()\n", user);
    // console.log("Extract:", user.password);
    res.status(200).json(successResponse("Password changed successfully"));
  } catch (error) {
    res.status(500).json(errorResponse("Internal server error"));
  }
};
module.exports = {
  register,
  verifyAccount,
  resendOtp,
  login,
  showInfo,
  changePassword,
  forgrtPassword,
  setNewPassword,
};
