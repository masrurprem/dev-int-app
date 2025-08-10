const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("database connected with success");
  })
  .catch((error) => {
    console.log("database connection error:", error);
  });
