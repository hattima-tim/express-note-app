const express = require('express');
const router = express.Router();
const home_controller=require('../controllers/homeController')

/* GET home page. */
router.get('/', home_controller.index);
router.get("/sign-up", home_controller.sign_up_get);
router.get("/log-in", home_controller.log_in_get);

module.exports = router;
