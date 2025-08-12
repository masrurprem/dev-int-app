const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

// verify token and return authenticated user: the auth middleware
const auth = async (req, res, next) => {
  try {
    //get token
    const token = req.header("Authorization").replace("Bearer ", "");
    // get payload and verify token
    const payload = jwt.verify(token, process.env.signature);
    // get the user
    const user = await userModel.findOne({
      email: payload.email,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    // return user with req obj
    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    res.status(400).send("please authenticate");
  }
};

module.exports = auth;
