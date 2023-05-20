const express = require('express');
const router = express.Router();
const home_controller=require('../controllers/homeController')

/* GET home page. */
router.get('/', home_controller.index);

module.exports = router;
