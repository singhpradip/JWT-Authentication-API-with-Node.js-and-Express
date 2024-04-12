require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
