const postRoute = require("express").Router();
const postModel = require("../models/postModel");
const auth = require("../middlewares/auth");

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

// user creates blogs
postRoute.post("/createNew", auth, async (req, res) => {
  //const newBlog = new postModel(req.body);
  const newBlog = new postModel({
    ...req.body,
    author: req.user._id,
  });
  try {
    await newBlog.save();
    res.status(200).send("blog saved");
  } catch (e) {
    res.status(404).send(e);
  }
});

//authenticated user gets own posts to read
postRoute.get("/post", auth, async (req, res) => {
  const authUser = req.user;
  try {
    //way-1:
    //const task = await postModel.find({ author: authUser._id });
    //way-2: using populate
    await authUser.populate("blogs");
    res.status(500).send(authUser.blogs);
  } catch (e) {
    res.status(404).send(e);
  }
});

// exports
module.exports = postRoute;
