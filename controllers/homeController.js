const Catagory = require("../models/catagory");
const Note = require("../models/note");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const bycript = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.index = asyncHandler(async (req, res, next) => {
  const [categories, numNotes] = await Promise.all([
    Catagory.find(),
    Note.countDocuments(),
  ]);

  res.render("index", {
    title: "Home",
    categories: categories,
    selectedCategory: "Home",
    note_count: numNotes,
  });
});

exports.sign_up_get = (req, res, next) => {
  res.render("authentication_form", { actionTitle: "Sign Up" });
};

exports.log_in_get = (req, res, next) => {
  const errors = req.flash("error");

  res.render("authentication_form", { actionTitle: "Log In", errors: errors });
};

exports.sign_up_post = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("The username must have atleast 3 characters.")
    .escape(),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("The password must have 8 characters.")
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      res.render("authentication_form", {
        actionTitle: "Sign Up",
        errors: errors,
      });
      return;
    }

    const { username, password } = req.body;
    const hashedPassword = await bycript.hash(password, 10);

    const user = new User({
      username: username,
      password: hashedPassword,
    });

    await user.save();
    req.login(user, (err) => {
      if (err) {
        res.status(401).send("User not authenticated");
      } else {
        res.redirect("/");
      }
    });
  }),
];

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureFlash: true,
});

exports.log_out = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}