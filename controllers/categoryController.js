const Category = require("../models/catagory");
const Note = require("../models/note");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.note_list = asyncHandler(async (req, res, next) => {
  const [selectedCategory, categories, catergoryNotes] = await Promise.all([
    Category.findById(req.params.id).orFail(new Error("Category not found.")),
    Category.find(),
    Note.find({ catagory: req.params.id }),
  ]);

  res.render("note_list", {
    title: "Notes",
    categories: categories,
    selectedCategory: selectedCategory.name,
    selectedCategoryId: selectedCategory._id,
    notes: catergoryNotes,
  });
});

exports.note_create_get = asyncHandler(async (req, res, next) => {
  const [categories, selectedCategory] = await Promise.all([
    Category.find(),
    Category.findById(req.params.id),
  ]);

  res.render("note_form", {
    title: "Create Note",
    categories: categories,
    selectedCategory: selectedCategory.name,
  });
});

exports.note_create_post = [
  body("title", "Title must have atleast three characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("details", "Details must have atleast three characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    const newNote = new Note({
      title: req.body.title,
      details: req.body.details,
      catagory: req.params.id,
    });

    if (errors.length > 0) {
      const categories = await Category.find();

      res.render("note_form", {
        title: "Create Note",
        categories: categories,
        noteTitle: req.body.title,
        details: req.body.details,
        errors: errors,
      });
    } else {
      await newNote.save();
      res.redirect(`/category/${req.params.id}`);
    }
  }),
];

exports.note_detail = asyncHandler(async (req, res, next) => {
  const [categories, selectedCategory, note] = await Promise.all([
    Category.find(),
    Category.findById(req.params.categoryId),
    Note.findById(req.params.noteId).orFail(new Error("Note not found")),
  ]);

  res.render("note_detail", {
    title: `${note.title}`,
    categories: categories,
    selectedCategory: selectedCategory.name,
    note: note,
  });
});

exports.note_update_get = asyncHandler(async (req, res, next) => {
  const [categories, selectedCategory, note] = await Promise.all([
    Category.find(),
    Category.findById(req.params.categoryId).orFail(
      new Error("Category not found.")
    ),
    Note.findById(req.params.noteId).orFail(new Error("Note not found.")),
  ]);

  res.render("note_form", {
    title: "Update Note",
    categories: categories,
    selectedCategory: selectedCategory.name,
    noteTitle: note.title,
    details: note.details,
  });
});

exports.note_update_post = [
  body("title", "Title must have atleast three characters.")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("details", "Details must have atleast three characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    const updatedNote = new Note({
      title: req.body.title,
      details: req.body.details,
      catagory: req.params.categoryId,
      _id: req.params.noteId,
    });

    if (errors.length > 0) {
      const categories = await Category.find();

      res.render("note_form", {
        title: "Create Note",
        categories: categories,
        noteTitle: req.body.title,
        details: req.body.details,
        errors: errors,
      });
    } else {
      await Note.findByIdAndUpdate(req.params.noteId, updatedNote);
      res.redirect(`/category/${req.params.categoryId}`);
    }
  }),
];
