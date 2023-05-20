const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/:id", category_controller.note_list);

module.exports = router;
