const express = require("express");
const router = express.Router();
const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/:id", category_controller.note_list);

router.get("/:id/create", category_controller.note_create_get);

router.post("/:id/create", category_controller.note_create_post);

router.get("/:categoryId/note/:noteId", category_controller.note_detail);

router.get(
  "/:categoryId/note/:noteId/update",
  category_controller.note_update_get
);

router.post(
  "/:categoryId/note/:noteId/update",
  category_controller.note_update_post
);

router.post(
  "/:categoryId/note/:noteId/delete",
  category_controller.note_delete_post
);

module.exports = router;
