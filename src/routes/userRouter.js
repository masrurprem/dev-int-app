const userRoute = require("express").Router();
const userModel = require("../models/userModel");
const sendWelcomeMail = require("../email/userEmail");

// user register route
userRoute.post("/register", async (req, res) => {
  //create user instance
  const newUser = new userModel(req.body);
  try {
    ///save user to database collection and send welcome email
    await newUser.save();
    sendWelcomeMail(newUser.email, newUser.name);
    res.status(200).send("user successfully registered");
  } catch (err) {
    //console.log(err);
    res.status(400).send("unable to register..try again");
  }
});

// export
module.exports = userRoute;
