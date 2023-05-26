const express = require("express");
const router = express.Router();
const home_controller = require("../controllers/homeController");

/* GET home page. */
router.get("/", home_controller.index);
router.get("/sign-up", home_controller.sign_up_get);
router.get("/log-in", home_controller.log_in_get);
router.post("/sign-up", home_controller.sign_up_post);
router.post("/log-in", home_controller.log_in_post);
router.post('/log-out',home_controller.log_out)

module.exports = router;
