const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { secretKey, expiresIn } = require("../config/jwt");
const { generateOTP } = require('../utils/generateOTP');
const { sendVerificationEmail } = require('../utils/email');

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, tokenVersion: user.tokenVersion }, secretKey, { expiresIn });
};

// const register = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;
//     const isUser = await User.findOne({ email });
//     if (!isUser) {
//       const hashedPassword = await bcrypt.hash(password, 10);
//       const user = await User.create({
//         username,
//         email,
//         password: hashedPassword,
//       });
//       const token = generateToken(user);
//       res.status(201).json({ user, token });
//     } else {
//       return res
//         .status(200)
//         .json({ message: "User already exist, try another email" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user with email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Generate OTP
    const otp = generateOTP();
    // console.log (otp);

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      otp
    });
    await newUser.save();

    // Send verification email with OTP
    await sendVerificationEmail(email, otp);

    res.status(201).json({ message: 'Registration successful. Please check your email for verification.' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
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
    const token = generateToken(user);
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

// const showInfo = async (req, res) => {
//     res.json("this is showInfo")
// };


const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password matches
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    user.tokenVersion += 1;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  showInfo,
  changePassword
};
