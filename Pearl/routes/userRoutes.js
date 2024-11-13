const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();

//GET /users/new
router.get("/new", controller.new);

//GET /users/login
router.get("/login", controller.login);

//GET /users/profile
router.get("/profile", controller.profile);

module.exports = router;
