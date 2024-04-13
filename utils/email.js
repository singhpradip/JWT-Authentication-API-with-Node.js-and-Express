const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (to, otp) => {
    console.log(`mymail User: ${process.env.EMAIL_USER} \nmyMail Pass: ${process.env.EMAIL_PASS}\nSent to: ${to}\n*********One more step ! `);
  // const mailOptions = {
  //   from: process.env.EMAIL_USER,
  //   to,
  //   subject: 'Email Verification',
  //   text: `Your verification code is: ${otp}`,
  //   html: `<p>Your verification code is: <strong>${otp}</strong></p>`
  // };

  // await transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //     // Handle error
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //     // Handle success
  //   }
  // });
};

module.exports = { sendVerificationEmail };
