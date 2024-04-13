const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "username is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String,
    maxlength: [6, "Maximun length sholud be 6" ]
  },
  tokenVersion: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("User", userSchema);
