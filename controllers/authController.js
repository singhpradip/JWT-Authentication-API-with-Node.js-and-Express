const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { secretKey, expiresIn, OTPexpiresIn } = require("../config/jwt");
const { generateOTP } = require("../utils/generateOTP");
const { sendVerificationEmail } = require("../utils/sendEmail");
const { successResponse, sendError } = require("../utils/response");

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      darkMode: user.darkMode,
      tokenVersion: user.tokenVersion,
    },
    secretKey,
    { expiresIn }
  );
};
const generateTempToken = (email) => {
  return jwt.sign({ email: email }, secretKey, {
    expiresIn: OTPexpiresIn,
  });
};
const sendOtp = async (email, name = null) => {
  try {
    const otp = generateOTP();
    await sendVerificationEmail(email, otp, name);

    const tempToken = generateTempToken(email);
    // console.log({ OTP: otp, Token: tempToken });
    // console.log("OTP sent successfully to:", email);
    return { tempToken, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return sendError(
        res,
        "User already registered, Proceed to login or use new email",
        400
      );
    }
    // console.log (existingUser);

    const { tempToken, otp } = await sendOtp(email, name);
    // console.log (otp);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { name, password: hashedPassword, otp },
      { new: true, upsert: true }
    );
    // console.log (user);
    if (!user) {
      return sendError(res, "Failed to register user", 500);
    }

    const verificationUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/verify-account?tempToken=${tempToken}`;

    res.status(201).json(
      successResponse("Verify account using OTP sent to your email", {
        verificationUrl,
      })
    );
  } catch (error) {
    console.error(error);
    return sendError(res, error.message, 500);
  }
};
const resendAccountVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.isVerified) {
      return sendError(res, "Your account is already verified", 400);
    }

    const { tempToken, otp } = await sendOtp(email, user.name);

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
    return sendError(res, error.message, 400);
  }
};
const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.isVerified) {
      return sendError(
        res,
        "User already registered, Proceed to login or use another email",
        400
      );
    }
    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP, not matched", 400);
    }

    user.isVerified = true;
    user.otp = "";
    await user.save();

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.name);
    return res
      .status(200)
      .json(successResponse("User logged in successfully", { user, token }));
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "Invalid email or password", 402);
    }

    if (!user.isVerified) {
      console.log(
        "User is not verified\nTODO: redirect user to the OTP Verification page with email payload"
      );
      return sendError(
        res,
        "Your account is not verified, Please verify first !",
        403
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return sendError(res, "Invalid email or password", 401);
    }

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.name);
    return res
      .status(200)
      .json(successResponse("User logged in successfully", { user, token }));
  } catch (error) {
    return sendError(res, "Internal server error", 500);
  }
};
const showInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    return res
      .status(200)
      .json(successResponse("User data retrieved successfully", { user }));
  } catch (error) {
    return sendError(res, error.message, 500);
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return sendError(res, "Current password is incorrect", 401);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    res.status(200).json(successResponse("Password changed successfully"));
  } catch (error) {
    return sendError(res, "Internal server error", 500);
  }
};
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const user = await User.findOne({ email });
    // console.log(user);
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const { tempToken, otp } = await sendOtp(email);

    user.otp = otp;
    await user.save();

    const verificationUrl = `${req.protocol}://${req.get("host")}${
      req.originalUrl
    }/verify?tempToken=${tempToken}`;

    console.log({
      Message: "OTP sent Successfuly!",
    });

    return res
      .status(200)
      .json(successResponse("OTP sent Successfully!", { verificationUrl }));
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
const resendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    const { tempToken, otp } = await sendOtp(email);
    user.otp = otp;
    await user.save();
    console.log("OTP Resent Successfully");
    return res
      .status(200)
      .json(
        successResponse("OTP Resent Successfully!", { newTempToken: tempToken })
      );
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};
const setNewPassword = async (req, res) => {
  try {
    const { user, newPassword } = req.body;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    // console.log("This is SetPassword()\n", user);
    // console.log("Extract:", user.password);
    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.name);
    return res
      .status(200)
      .json(successResponse("Password changed successfully", { user, token }));
  } catch (error) {
    return sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  register,
  verifyAccount,
  resendAccountVerificationOtp,
  login,
  showInfo,
  changePassword,
  forgetPassword,
  resendPasswordResetOtp,
  setNewPassword,
};
