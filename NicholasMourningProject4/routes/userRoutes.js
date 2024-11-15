const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();

//GET /users/new
router.get("/new", controller.new);

//POST /users: create a new user
router.post("/", controller.create);

//GET /users/login
router.get("/login", controller.getUserLogin);

//Post /users/login
router.post("/login", controller.login)

//GET /users/profile
router.get("/profile", controller.profile);

//POST /users/logout: logout a user
router.get("/logout", controller.logout);

module.exports = router;
