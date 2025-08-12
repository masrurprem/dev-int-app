const postRoute = require("express").Router();
const postModel = require("../models/postModel");
const auth = require("../middlewares/auth");

// getting all the blogs: the public route
postRoute.get("/all", async (req, res) => {
  // necessary for pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;

  // for sorting
  const sortOps = { createdAt: -1 }; // sort by newest post

  //filtering post by job verdict
  const filterObj = {};
  if (req.query.verdict) {
    filterObj.verdict = req.query.verdict;
  }

  try {
    const blogs = await postModel
      .find(filterObj)
      .populate("author")
      .sort(sortOps)
      .skip(skip)
      .limit(limit);
    if (!blogs) {
      res.status(404).send("no posts available on such");
    }
    res.status(200).send(blogs);
  } catch (e) {
    //console.log(e);
    res.status(500).send("error getting blog posts");
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

//authenticated user gets own posts to read: all posts
postRoute.get("/post", auth, async (req, res) => {
  const authUser = req.user;
  //pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 3;
  const skip = (page - 1) * limit;
  //sorting
  const sortOps = { createdAt: -1 };
  try {
    //way-1:
    //const task = await postModel.find({ author: authUser._id });
    //way-2: using populate
    await authUser.populate({
      path: "blogs",
      options: {
        skip: skip,
        limit: limit,
        sort: sortOps,
      },
    });
    res.status(200).send(authUser.blogs);
  } catch (e) {
    res.status(500).send(e);
  }
});

//auth User reads specific post: get by id
postRoute.get("/post/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const post = await postModel.findOne({ _id, author: req.user._id });
    // still no relevant user post return error response
    if (!post) {
      return res.status(404).send();
    }
    res.status(200).send(post);
  } catch (e) {
    res.status(500).send(e);
  }
});

//update a post by auth user: update by id
postRoute.patch("/post/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    "company",
    "position",
    "title",
    "verdict",
    "content",
    "remarks",
  ];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    return res.status(400).send("invalid updates");
  }
  // operations are valid so update now
  try {
    const post = await postModel.findOne({
      _id: req.params.id,
      author: req.user._id,
    });
    if (!post) {
      res.status(404).send();
    }
    // valid post: so update each given attribute
    updates.forEach((updateKey) => (post[updateKey] = req.body[updateKey]));
    //save the updated+extant info to database
    await post.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

// auth user deletes a post
postRoute.delete("/post/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    const deletedPost = await postModel.findOneAndDelete({
      _id,
      author: req.user._id,
    });
    if (!deletedPost) {
      return res.status(404).send();
    }
    res.status(200).send(deletedPost);
  } catch (e) {
    res.status(500).send();
  }
});

// exports
module.exports = postRoute;
