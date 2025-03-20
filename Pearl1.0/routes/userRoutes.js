const express = require("express");
const controller = require("../controllers/userController");
const router = express.Router();
const { isGuest, isLoggedIn } = require("../middlewares/auth");
const { logInLimiter } = require("../middlewares/rateLimiters");
const {
  validateSignUp,
  validateLoginIn,
  validateResult,
} = require("../middlewares/validator");

//GET /users/new
router.get("/new", isGuest, controller.new);

//POST /users: create a new user
router.post("/", isGuest, validateSignUp, validateResult, controller.create);

//GET /users/login
router.get("/login", isGuest, controller.getUserLogin);

//Post /users/login
router.post(
  "/login",
  logInLimiter,
  isGuest,
  validateLoginIn,
  validateResult,
  controller.login
);

//GET /users/profile
router.get("/profile", isLoggedIn, controller.profile);

//POST /users/logout: logout a user
router.get("/logout", isLoggedIn, controller.logout);

module.exports = router;
