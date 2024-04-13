const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.emailPassword
  }
});

const sendVerificationEmail = async (to, otp) => {
    console.log(to, otp);
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to,
//     subject: 'Email Verification',
//     text: `Your verification code is: ${otp}`,
//     html: `<p>Your verification code is: <strong>${otp}</strong></p>`
//   };

//   await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
