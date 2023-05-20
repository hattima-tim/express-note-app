const Category = require("../models/catagory");
const Note = require("../models/note");
const asyncHandler = require("express-async-handler");

exports.note_list = asyncHandler(async (req, res, next) => {
  const [selectedCategory, categories, catergoryNotes] = await Promise.all([
    Category.findById(req.params.id, "name").orFail(
      new Error("Category not found.")
    ),
    Category.find(),
    Note.find({ catagory: req.params.id }),
  ]);

  res.render("note_list", {
    title: "Notes",
    categories: categories,
    selectedCategory: selectedCategory.name,
    notes: catergoryNotes,
  });
});
