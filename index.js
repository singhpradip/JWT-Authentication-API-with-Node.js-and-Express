require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json()); // Parse JSON bodies, result in 'req.body'
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies, result in 'req.body'
app.use(cookieParser()); // Parse cookies, result in 'req.cookies'

// Routes
app.use("/auth", authRoutes);

// Middle to handle uncatched error, yesle server shutdown hunw batw bachauxw
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
