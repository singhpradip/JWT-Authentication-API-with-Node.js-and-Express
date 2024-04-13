const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  await mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
      console.log("Lets MongoDB");
    })
    .catch((err) => console.error(err));
};

module.exports = connectDB;
