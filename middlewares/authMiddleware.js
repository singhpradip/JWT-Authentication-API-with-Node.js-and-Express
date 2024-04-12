const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");

exports.verifyToken = (req, res, next) => {
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
    req.userId = decoded.userId;
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
