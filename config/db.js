
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Let's Mongoose");
    })
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = connectDB;
