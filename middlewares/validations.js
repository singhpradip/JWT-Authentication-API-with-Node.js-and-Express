const joi = require("joi");

exports.regValidate = (req, res, next) => {
  try {
    const registrationSchema = joi.object({
      username: joi.string().alphanum().min(3).max(30).required().messages({
        "string.base": "Username must be a string",
        "string.empty": "Username is required",
        "string.min": "Username must have at least {#limit} characters",
        "string.max": "Username can have at most {#limit} characters",
        "any.required": "Username is required",
      }),
      email: joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "string.empty": "Email is required",
        "any.required": "Email is required",
      }),
      password: joi.string().min(6).required().messages({
        "string.min": "Password must have at least {#limit} characters",
        "string.empty": "Password is required",
        "any.required": "Password is required",
      }),
    });
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: error.details.map((err) => err.message) });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
