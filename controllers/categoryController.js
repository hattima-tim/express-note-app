const Category = require("../models/catagory");
const Note = require("../models/note");
const asyncHandler = require("express-async-handler");

exports.note_list = asyncHandler(async (req, res, next) => {
  const [selectedCategory, categories, catergoryNotes] = await Promise.all([
    Category.findById(req.params.id).orFail(
      new Error("Category not found.")
    ),
    Category.find(),
    Note.find({ catagory: req.params.id }),
  ]);

  res.render("note_list", {
    title: "Notes",
    categories: categories,
    selectedCategory: selectedCategory.name,
    selectedCategoryId:selectedCategory._id,
    notes: catergoryNotes,
  });
});

exports.note_create_get = asyncHandler(async (req, res, next) => {
  const categories = await Category.find();

  res.render('note_form',{
    title:'Create Note',
    categories:categories
  })
});