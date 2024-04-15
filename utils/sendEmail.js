const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

const sendVerificationEmail = async (userEmail, otp, username) => {
  // const otp = 332434;
  const myEmail = process.env.EMAIL_USER;
  const clientId = process.env.clientId;
  const clientSecret = process.env.clientSecret;
  const redirectUrl = process.env.redirectUrl;
  const refreshToken = process.env.refreshToken;

  // console.log(process.env.clientId);

  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUrl
  );
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  // console.log(oAuth2Client);

  try {
    const accessToken = await oAuth2Client.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: myEmail,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "User Authentication <myEmail>",
      to: userEmail,
      subject: "OTP Verification",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="background-color: #007bff; color: #fff; padding: 10px; text-align: center;">
            <h1>OTP Verification</h1>
          </div>
          <div style="background-color: #f4f4f4; padding: 20px;">
            <p>Dear ${username || "User"},</p>
            <p>Please use the following OTP ${
              username ? "to verify your account" : "to Reset your password"
            }:</p>
            <div style="margin-bottom: 20px; text-align: center;">
              <h2 style="font-size: 36px; margin: 0;">${otp}</h2>
            </div>
            <p>If you did not request this verification, please ignore this email.</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p>Thank you,<br />API developed by Pradip Singh</p>
          </div>
        </div>
      `,
    };

    await transport.sendMail(mailOptions);
    console.log("Email with OTP sent successfully:");
  } catch (error) {
    console.error("Error sending email with OTP:", error);
    return error;
  }
};

module.exports = { sendVerificationEmail };
