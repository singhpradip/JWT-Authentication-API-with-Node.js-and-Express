const joi = require("joi");
const { sendError } = require("../utils/response");

const validateUserData = (req, res, next) => {
  try {
    const registrationSchema = joi.object({
      name: joi.string().min(3).max(30).required().messages({
        "string.base": "Name should be a type of text",
        "string.empty": "Name cannot be an empty field",
        "string.min": "Name should have a minimum length of {#limit}",
        "string.max": "Name should have a maximum length of {#limit}",
        "any.required": "Name is a required field",
      }),
      email: joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
      }),
      password: joi.string().min(6).max(18).required().messages({
        "string.min": "New password should have a minimum length of {#limit}",
        "string.max": "New password should have a maximum length of {#limit}",
        "string.empty": "New password cannot be an empty field",
        "any.required": "New password is a required field",
      }),
    });

    const otpSchema = joi.object({
      email: joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "string.empty": "Email cannot be an empty field",
        "any.required": "Email is a required field",
      }),
      otp: joi
        .string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
          "string.pattern.base": "OTP must be a 6-digit number",
          "string.empty": "OTP cannot be an empty field",
          "any.required": "OTP is a required field",
        }),
    });

    const validateOtp = joi.object({
      otp: joi
        .string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
          "string.pattern.base": "OTP must be a 6-digit number",
          "string.empty": "OTP cannot be an empty field",
          "any.required": "OTP is a required field",
        }),
    });

    const resetPasswordSchema = joi.object({
      newPassword: joi.string().min(6).max(18).required().messages({
        "string.min": "New password should have a minimum length of {#limit}",
        "string.max": "New password should have a maximum length of {#limit}",
        "string.empty": "New password cannot be an empty field",
        "any.required": "New password is a required field",
      }),
      otp: joi
        .string()
        .pattern(/^\d{6}$/)
        .required()
        .messages({
          "string.pattern.base": "OTP must be a 6-digit number",
          "string.empty": "OTP cannot be an empty field",
          "any.required": "OTP is a required field",
        }),
    });

    let schema;

    if (req.body.name && req.body.email && req.body.password) {
      schema = registrationSchema;
    } else if (req.body.email && req.body.otp) {
      schema = otpSchema;
    } else if (req.body.newPassword && req.body.otp) {
      schema = resetPasswordSchema;
    } else if (req.body.otp) {
      schema = validateOtp;
    } else {
      return sendError(res, "Validation not defined", 400);
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return sendError(
        res,
        error.details.map((err) => err.message),
        400
      );
    }

    next();
  } catch (error) {
    console.log(error);
    return sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  validateUserData,
};
