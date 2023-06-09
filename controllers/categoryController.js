const Category = require("../models/catagory");
const Note = require("../models/note");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.note_list = asyncHandler(async (req, res, next) => {
  const [selectedCategory, categories, catergoryNotes] = await Promise.all([
    Category.findById(req.params.id).orFail(new Error("Category not found.")),
    Category.find({ user: req.user._id }),
    Note.find({ catagory: req.params.id, user: req.user._id }),
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
    Category.find({ user: req.user._id }),
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
      user: req.user._id,
    });

    if (errors.length > 0) {
      const categories = await Category.find({ user: req.user._id });

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
    Category.find({ user: req.user._id }),
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
    Category.find({ user: req.user._id }),
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
      user: req.user._id,
      _id: req.params.noteId,
    });

    if (errors.length > 0) {
      const categories = await Category.find({ user: req.user._id });

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

exports.note_delete_post = asyncHandler(async (req, res, next) => {
  await Note.findByIdAndDelete(req.params.noteId).orFail(
    new Error("Note not found.")
  );
  res.redirect(`/category/${req.params.categoryId}`);
});

exports.category_update_post = [
  body("categoryName")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("- The name must have minimum 3 char and maximum 20 char.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      const [selectedCategory, categories, catergoryNotes] = await Promise.all([
        Category.findById(req.params.id).orFail(
          new Error("Category not found.")
        ),
        Category.find({ user: req.user._id }),
        Note.find({ catagory: req.params.id, user: req.user._id }),
      ]);

      res.render("note_list", {
        title: "Notes",
        categories: categories,
        selectedCategory: selectedCategory.name,
        selectedCategoryId: selectedCategory._id,
        notes: catergoryNotes,
        errors: errors,
      });
    } else {
      const updatedCategory = new Category({
        name: req.body.categoryName,
        user: req.user._id,
        _id: req.params.id,
      });

      await Category.findByIdAndUpdate(req.params.id, updatedCategory);
      res.redirect(`/category/${req.params.id}`);
    }
  }),
];

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  await Category.findByIdAndDelete(req.params.id).orFail(
    new Error("Something went wrong.")
  );

  await Note.deleteMany({ catagory: req.params.id });

  res.redirect(`/`);
});

exports.category_create_post = [
  body("categoryName").trim().isLength({ min: 3, max: 16 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      const currentPath = req.originalUrl;

      if (currentPath === "/category/createcategory") {
        res.redirect("/");
      } else {
        req.originalUrl.includes("update")
          ? res.redirect(req.originalUrl.replace(/update\/createcategory$/, ""))
          : res.redirect(req.originalUrl.replace(/createcategory$/, ""));
        // 'update' url has no get controller registered,
        // hence I am removing it from the url
      }
    } else {
      const [isTheCategoryExist] = await Category.find({
        name: req.body.categoryName,
        user: req.user._id,
      });

      if (isTheCategoryExist) {
        res.redirect(`/category/${isTheCategoryExist._id}`);
      } else {
        const newCategory = new Category({
          name: req.body.categoryName,
          user: req.user._id,
        });

        await newCategory.save();
        res.redirect(`/category/${newCategory._id}`);
      }
    }
  }),
];
