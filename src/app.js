const express = require("express");
const app = express();
const database = require("./database/db");
const userRoute = require("./routes/userRouter");
const postRoute = require("./routes/postRouter");
const searchRoute = require("./routes/searchRouter");
//
app.use(express.json());
app.use("/user", userRoute);
app.use("/blog", postRoute);
app.use("/search", searchRoute);

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log("could not connect to server");
  }
  console.log("server started on port", port);
});
