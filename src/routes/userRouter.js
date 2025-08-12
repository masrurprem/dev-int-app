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
    res.status(200).send(newUser);
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

//getting user profile: later to be completed
userRoute.get("/profile", auth, async (req, res) => {
  // auth user just gets own profile
  res.send(req.user);
});

// update user route
userRoute.post("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send("invalid updates..try again carefully");
  }
  try {
    updates.forEach((updateKey) => (req.user[updateKey] = req.body[updateKey]));
    // save updated user to database
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

//user logout route
userRoute.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((tokenObj) => {
      return tokenObj.token !== req.token;
    });
    await req.user.save();
    //res.status(200).send("You're successfully logged out!");
    res.status(200).send(req.user);
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

// delete user profile
userRoute.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

// export
module.exports = userRoute;
