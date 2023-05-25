const Catagory = require("../models/catagory");
const Note = require("../models/note");
const asyncHandler = require("express-async-handler");

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

exports.sign_up_get=(req,res,next)=>{
  res.render('authentication_form',{actionTitle:'Sign Up'})
}
