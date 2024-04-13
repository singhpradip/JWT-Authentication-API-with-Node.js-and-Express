const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");
const User = require("../models/user");

const verifyToken = async (req, res, next) => {
  const tokenString = req.headers.authorization;
  if (!tokenString) {
    console.log("No token received");
    return res.status(401).json({ message: "Authorization token is missing" });
  }

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
    console.log(tokenVersion + " \n" + userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.tokenVersion !== tokenVersion) {
      return res
        .status(401)
        .json({ message: "Token has expired. Please reauthenticate." });
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

const verifyTempToken = async (req, res, next) => {
  const tokenString = req.headers.authorization;

  if (!tokenString) {
    console.log("No token received");
    return res.status(401).json({ message: "Authorization token is missing" });
  }

  const token = tokenString.split(" ")[1];
  // console.log(token);
  if (!token) {
    console.log("No token received");
    return res.status(401).json({ message: "Authorization token is missing" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    const { email } = decoded;
    // console.log("Email:" + email);
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: "Not the correct Token !" });
    }
    req.body.email = email;
    // console.log("Token: PASS");
    next();
  } catch (error) {
    console.log("Invalid token");
    res.status(401).json({ message: "Session Expired, try again" });
  }
};

const verifyTempTokenFromParams = async (req, res, next) => {
  const { token, otp } = req.params;

  if (!token) {
    console.log("No token received");
    return res.status(401).json({ message: "Authorization token is missing" });
  }
  try {
    const decoded = jwt.verify(token, secretKey);
    // console.log(decoded);
    const { email } = decoded;
    // console.log("Email:" + email);
    const user = await User.findOne({ email });
    // console.log(user)
    if (!user) {
      return res.status(404).json({ message: "Not the correct Token !" });
    }
    req.body.email = email;
    req.body.otp = otp;
    // console.log("Token: PASS");
    next();
  } catch (error) {
    console.log("Invalid token");
    res.status(401).json({ message: "Session Expired, try again" });
  }
};

const otpVerify= async (req, res, next)=>{
  try{
    const { email, otp } = req.body;
    // console.log("otpVerify data: "+ email, otp);
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ Message: "user not found" });
    }

    if (user.otp == otp) {
      console.log("OTP matched");
      req.body.user= user;
      next();
    }
    else{
      console.log("otp not matched")
      return res.status(403).json({ Message: "Invlid OTP" });
    }

  }catch(error){
    console.log(error);
    return res.status(500).json({Message: error});

  }


}

module.exports = {
  verifyToken,
  verifyTempToken,
  verifyTempTokenFromParams,
  otpVerify,
};
