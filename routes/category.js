const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/:id", category_controller.note_list);
router.get('/:id/create',category_controller.note_create_get)

module.exports = router;
