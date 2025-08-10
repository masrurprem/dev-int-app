const mongoose = require("mongoose");
const validator = require("validator");

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

// user model
const userModel = new mongoose.model("userModel", userSchema);

module.exports = userModel;
