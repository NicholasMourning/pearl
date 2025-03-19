const { body } = require("express-validator");
const { validationResult } = require("express-validator");

exports.validateItem = [
  body("title").trim().notEmpty().withMessage("Title is required").escape(),
  body("condition")
    .trim()
    .isIn([
      "Used",
      "Used - good condition",
      "Used - like new",
      "Refurbished",
      "New",
      "New - without tags",
      "New - with tags",
    ])
    .withMessage("Invalid condition")
    .escape(),
  body("price").trim().isCurrency().withMessage("Invalid price"),
];

exports.validateSignUp = [
  body("firstName", "First name cannot be empty").notEmpty().trim().escape(),
  body("lastName", "last name cannot be empty").notEmpty().trim().escape(),
  body("email", "Email must be a valid email address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64"
  ).isLength({ min: 8, max: 64 }),
];

exports.validateLoginIn = [
  body("email", "Email must be a valid email address")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail(),
  body(
    "password",
    "Password must be at least 8 characters and at most 64"
  ).isLength({ min: 8, max: 64 }),
];

exports.validateResult = (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(req.get("Referrer") || "/");
  } else {
    return next();
  }
};
