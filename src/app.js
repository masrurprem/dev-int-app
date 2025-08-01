const express = require("express");
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log("could not connect to server");
  }
  console.log("server started on port", port);
});
