const authMiddleware = require("../middleware/authMiddleware");
const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const categoryList = await Category.find();
  if (!categoryList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(categoryList);
});

router.post("/create", authMiddleware, async (req, res) => {
  // Check if at least two images are provided
  if (!req.body.image || req.body.image.length < 2) {
    return res.status(400).send("2 ảnh trở lên!");
  }

  let category = new Category({
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
  });

  category = await category.save();

  if (!category) return res.status(404).send("the category cannot be created!");

  res.status(200).json(category);
});

router.patch("/update/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    image: req.body.image,
    description: req.body.description,
  });

  if (!category) return res.status(404).send("the category cannot be updated!");

  res.status(200).json(category);
});

router.delete("/delete/:id", async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).send("the category cannot be deleted!");
  res.status(200).json(category);
});

module.exports = router;
