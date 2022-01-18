const express = require("express");
const router = express.Router();

const categoryModel = require("../../models/Category");

// Add category
router.post("/addcategory", (req, res) => {
  categoryModel.findOne({ name: req.body.name }, (error, category) => {
    if (error) {
      return res.status(200).json({
        error: true,
        message: error.message,
      });
    } else if (category) {
      return res.status(200).json({
        error: true,
        message: "Category already exists",
      });
    } else {
      const newCategory = new categoryModel({
        name: req.body.name,
      });
      newCategory
        .save()
        .then((category) =>
          res.status(200).json({
            success: true,
            error: false,
            category: category,
            message: "Category successfully added!",
          })
        )
        .catch((err) => {
          return res
            .status(200)
            .json({
              error: true,
              success: false,
              message: "Please try agin later",
            });
        });
    }
  });
});

// Get all categories
router.get("/getcategories", (req, res) => {
  categoryModel.find({}, (err, docs) => {
    if (err) {
      return res.status(400).json({
        error: true,
        message: err.message,
      });
    } else {
      return res.status(200).json({
        error: false,
        message: "Here you go good sir",
        data: docs,
      });
    }
  });
});

module.exports = router;
