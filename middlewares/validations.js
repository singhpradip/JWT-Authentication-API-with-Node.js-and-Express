const joi = require("joi");

const validateUserData = (req, res, next) => {
  try {
    const registrationSchema = joi.object({
      username: joi.string().alphanum().min(3).max(30).required(),
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });

    const otpSchema = joi.object({
      email: joi.string().email().required(),
      otp: joi
        .string()
        .pattern(/^\d{6}$/)
        .required(),
    });

    let schema;
    if (req.body.username && req.body.email && req.body.password) {
      schema = registrationSchema;

    } else if (req.body.email && req.body.otp) {
      schema = otpSchema;
      
    } else {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const { error } = schema.validate(req.body);
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

module.exports = {
  validateUserData,
};
