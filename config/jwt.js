require('dotenv').config();
module.exports = {
  secretKey: process.env.ACCESS_TOKEN_SECRET,
  refreshKey: process.env.REFRESS_TOKEN_SECRET,
  expiresIn: process.env.expiresIn,
  OTPexpiresIn: process.env.OTPexpiresIn
};
  