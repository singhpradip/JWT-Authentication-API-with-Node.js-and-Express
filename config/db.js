const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.MONGO_DB_URL;
// const DB_URL = process.env.MONGO_DB_REMOTE_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(DB_URL).then(() => {
      console.log("Let's Mongoose");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = connectDB;
