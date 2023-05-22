const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/:id", category_controller.note_list);
router.get("/:id/create", category_controller.note_create_get);
router.post("/:id/create", category_controller.note_create_post);
router.get('/:categoryId/note/:noteId',category_controller.note_detail)

module.exports = router;
