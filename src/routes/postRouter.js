const postRoute = require("express").Router();
const postModel = require("../models/postModel");

// getting all the blogs: the public route
postRoute.get("/all", async (req, res) => {
  try {
    const blogs = await postModel.find({});
    if (!blogs) {
      res.status(404).send("no posts available");
    }
    res.status(200).send(blogs);
  } catch (e) {
    res.status(400).send("error getting blog posts");
  }
});

//
postRoute.post("/createNew", async (req, res) => {
  const newBlog = new postModel(req.body);
  try {
    await newBlog.save();
    res.status(200).send("blog saved");
  } catch (e) {
    res.status(404).send("error creating blog", e);
  }
});

// exports
module.exports = postRoute;
