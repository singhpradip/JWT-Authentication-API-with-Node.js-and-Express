const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { secretKey, expiresIn, OTPexpiresIn } = require("../config/jwt");
const { generateOTP } = require("../utils/generateOTP");
const { sendVerificationEmail } = require("../utils/email");

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
const sendOtp = async (email) => {
  try {
    generateTempToken(email);
    const otp = generateOTP();
    await sendVerificationEmail(email, otp);

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
      return res.status(400).json({
        message: "User already registered, Proceed to login or use new email",
      });
    }
    // console.log (existingUser);

    const { tempToken, otp } = await sendOtp(email);
    // console.log (otp);

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { username, password: hashedPassword, otp },
      { new: true, upsert: true }
    );
    // console.log (user);

    console.log({
      Message: "OTP sent Successfuly!",
      newTempToken: tempToken,
      OTP: otp,
    });

    res.status(201).json({
      message: "Verify account using OTP sent to your email",
      tempToken: tempToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const verifyAccount = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ Message: "user not found" });
    }
    if (user.isVerified) {
      return res
        .status(200)
        .json({ Message: "Your account is already varified" });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP, not matched" });
    }

    user.isVerified = true;
    user.otp = "";
    await user.save();

    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);
    return res.status(200).json([{ Status: "logged in" }, { user, token }]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ Message: "user not found" });
    }
    if (user.isVerified) {
      return res
        .status(200)
        .json({ Message: "Your account is already varified" });
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
      .json({ Message: "OTP Resent Successfuly!", newTempToken: tempToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    if (!user.isVerified) {
      console.log(
        "TODO: redirect user to the OTP Verification page with email payload"
      );
      return res
        .status(403)
        .json("Your account is not verified, Please veify first !");
    }
    const token = generateToken(user);
    console.log("Logged In as_________________________" + user.username);
    res.json([{ Status: "logged in" }, { user, token }]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const showInfo = async (req, res) => {
  try {
    // Access userId from req object
    const userId = req.userId;
    // Fetch user data using userId
    const user = await User.findById(userId);
    // Respond with user profile data
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const forgrtPassword = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ Message: "user not found" });
    }

    const { tempToken, otp } = await sendOtp(email);

    user.otp = otp;
    await user.save();

    console.log({
      Message: "OTP sent Successfuly!",
      tempToken: tempToken,
      OTP: otp,
    });

    return res
      .status(200)
      .json({ Message: "OTP sent Successfuly!", tempToken: tempToken });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};
const setNewPassword = async (req, res) => {
  //Receive new password from body or anywhere, see it while implemnting frontend
  // for now lets get new password through req.body
  const { user, newPassword } = req.body;

  // TODO: Impliment params instead of req.body whenevr needed**** IMP
  // in verifyAccount, resendOtp

  if (!user.isVerified) {
    console.log(
      "TODO: redirect user to the OTP Verification page with email payload"
    );
    return res
      .status(403)
      .json("Your account is not verified, Please veify first !");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  user.tokenVersion += 1;
  await user.save();

  // console.log("This is SetPassword()\n", user);
  // console.log("Extract:", user.password);
  res.status(200).json({ message: "Password changed successfully" });
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
