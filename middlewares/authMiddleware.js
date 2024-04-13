const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");
const User = require("../models/user");

exports.verifyToken = async (req, res, next) => {
  const tokenString = req.headers.authorization;
  const token = tokenString.split(" ")[1];
  // console.log(token);
  if (!token) {
    console.log("No token received");
    return res.status(401).json({ message: "Authorization token is missing" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    const { userId, tokenVersion } = decoded;
    console.log(tokenVersion +" \n"+ userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.tokenVersion !== tokenVersion) {
      return res.status(401).json({ message: 'Token has expired. Please reauthenticate.' });
    }
    console.log("message: 'Token reauthenticated'");
    req.userId = userId;
    next();

  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "Invalid token" });
  }
};

// exports.verifyToken = (req, res, next) => {
//     console.log("This is middleWare");
//     req.userId = "6618e3cc1355167ce2ac33b4";
//     next();
// };
