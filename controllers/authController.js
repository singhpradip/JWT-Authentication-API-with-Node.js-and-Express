const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { secretKey, expiresIn } = require("../config/jwt");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, secretKey, { expiresIn: expiresIn });
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const isUser = await User.findOne({ email });
    if (!isUser) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      const token = generateToken(user);
      res.status(201).json({ user, token });
    } else {
      return res
        .status(200)
        .json({ message: "User already exist, try another email" });
    }
  } catch (error) {
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

module.exports = {
  register,
  login,
  showInfo,
};
