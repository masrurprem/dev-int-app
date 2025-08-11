const userRoute = require("express").Router();
const userModel = require("../models/userModel");
const sendWelcomeMail = require("../email/userEmail");
const bcrypt = require("bcryptjs");
const auth = require("../middlewares/auth");
require("dotenv").config();

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
//user login route
userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findByCredentials(email, password);
    //generate user token
    const token = await user.generateAuthToken();
    res.status(200).send({ user, token });
  } catch (e) {
    //console.log(e);
    res.status(404).send("login failed");
  }
});

//user logout route
userRoute.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      return tokenObj.token !== user.token;
    });
    await req.user.save();
    res.status(200).send("You're successfully logged out!");
  } catch (e) {
    res.status(404).send();
  }
});
//all device user log out
userRoute.post("/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.status(200).send("logged out from all devices");
  } catch (err) {
    res.status(404).send();
  }
});

//getting user profile: later to be completed

// export
module.exports = userRoute;
