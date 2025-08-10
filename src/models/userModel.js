const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// password hashing middleware: pre-Hook save
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    // password hash
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// user instance token generation function
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ email: user.email }, signature);
  // save token to user token array of obj
  user.tokens = user.tokens.concat({ token: token });
  await user.save();
  return token;
};

// user login function by credentials
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("unable to login");
  }
  // has user so password check
  const is_match = await bcrypt.compare(password, user.password);
  if (!is_match) {
    throw new Error("unable to login");
  }
  return user;
};

// user model
const userModel = new mongoose.model("userModel", userSchema);

module.exports = userModel;
