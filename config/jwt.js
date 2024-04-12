require('dotenv').config();
module.exports = {
  secretKey: process.env.secretKey,
  expiresIn: process.env.expiresIn,
};
  