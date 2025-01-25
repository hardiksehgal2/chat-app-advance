// backend\src\index.js
const express = require("express");
const cors = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const connectDB = require("./lib/db");

dotenv.config();
const app = express();

// Parse JSON bodies
// extract json data from request body
app.use(express.json());
app.use(cookieParser());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Enable CORS
app.use(cors());
const PORT = process.env.PORT || 5000;
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log("Server is running at port ", PORT);
  connectDB();
});
