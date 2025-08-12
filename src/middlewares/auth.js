const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

// verify token and return authenticated user: the auth middleware
const auth = async (req, res, next) => {
  try {
    // verify if auth header is present
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      throw new Error("auth header is missing in the request");
    }
    //get token
    const token = req.header("Authorization").replace("Bearer ", "");
    //console.log("token: ", token);
    // get payload and verify token
    const payload = jwt.verify(token, process.env.signature);
    //console.log("payload: ", payload);
    // get the user
    const user = await userModel.findOne({
      email: payload.email,
      "tokens.token": token,
    });
    // console.log(user.tokens);
    if (!user) {
      throw new Error("user not found with provided token");
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
