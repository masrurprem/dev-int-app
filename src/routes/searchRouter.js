const postModel = require("../models/postModel");
const searchRoute = require("express").Router();

//
searchRoute.get("/", async (req, res) => {
  const searchName = req.query.company;
  try {
    const blogs = await postModel.find({
      company: { $regex: new RegExp(searchName, "i") },
    });

    res.status(200).send(blogs);
  } catch (e) {
    res.status(404).send(e);
  }
});

module.exports = searchRoute;
