const mongoose = require("mongoose");

//post schema
const postSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  date: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
});

//post model
const postModel = new mongoose.model("postModel", postSchema);

module.exports = postModel;
