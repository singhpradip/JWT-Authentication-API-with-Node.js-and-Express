const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");
const User = require("../models/userSchema");
const { sendError } = require("../utils/response");

const verifyToken = async (req, res, next) => {
  const tokenString = req.headers.authorization;
  if (!tokenString) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  const token = tokenString.split(" ")[1];
  // console.log(token);
  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    const { userId, tokenVersion } = decoded;
    // console.log(tokenVersion + " \n" + userId);

    const user = await User.findById(userId);
    if (!user) {
      return sendError(res, "User not found", 404);
    }
    if (user.tokenVersion !== tokenVersion) {
      return sendError(res, "Token has expired. Please reauthenticate.", 401);
    }
    console.log("Valid Token !");

    req.body = {
      ID: user._id,
      name: user.name,
      email: user.email,
      darkMode: user.darkMode,
      profilePicture: user.profilePicture,
    };
    next();
  } catch (error) {
    // console.log(error);
    return sendError(res, "Invalid token", 401);
  }
};

// exports.verifyToken = (req, res, next) => {
//     console.log("This is middleWare");
//     req.userId = "6618e3cc1355167ce2ac33b4";
//     next();
// };

const verifyTempToken = async (req, res, next) => {
  // const tokenString = req.headers.authorization;

  // if (!tokenString) {
  //   console.log("No token received");
  //   return res.status(401).json({ message: "Authorization token is missing" });
  // }

  // const token = tokenString.split(" ")[1];
  // getting from url , like : /?tempToken=igsdhfgjhgv
  const { tempToken: token } = req.query;
  // console.log(token);
  if (!token) {
    console.log("No token received");
    return sendError(res, "Authorization token is missing", 401);
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    const { email } = decoded;
    // console.log("Email:" + email);
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return sendError(res, "Not the correct Token !", 404);
    }
    req.body.email = email;
    // console.log("Token: PASS");
    next();
  } catch (error) {
    console.log("Invalid token, ERROR:\n ", error);
    return sendError(res, "Session Expired, try again later", 401);
  }
};

const otpVerify = async (req, res, next) => {
  //use after verifyTempToken middle so that body get email
  try {
    const { email, otp } = req.body;
    // console.log("otpVerify data: "+ email, otp);

    const user = await User.findOne({ email });
    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (user.otp !== otp) {
      return sendError(res, "Invalid OTP", 403);
    }

    req.body.user = user;
    next();
  } catch (error) {
    console.log("OTP iis not valid");
    console.log(error);
    return sendError(res, error.message, 500);
  }
};

module.exports = {
  verifyToken,
  verifyTempToken,
  otpVerify,
};
