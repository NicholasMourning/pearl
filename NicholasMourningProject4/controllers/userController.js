const model = require("../models/user");
const item = require("../models/item");

//NEW
exports.new = (req, res, next) => {
  res.render("./users/new");
};

//CREATE
exports.create = (req, res, next) => {
  let user = new model(req.body);
  user
    .save()
    .then((user) => res.redirect("/users/login"))
    .catch((err) => {
      if (err.name === "ValidationError") {
        req.flash("error", err.message);
        console.log(err);
        return res.redirect("/users/new");
      }

      if (err.code === 11000) {
        console.log(err);
        req.flash("error", "Email has been used");
        return res.redirect("/users/new");

      }

      next(err);
    });
};

//GetUserLogin
exports.getUserLogin = (req, res, next) => {
  res.render("./users/login");
}

//Login
exports.login = (req, res, next) => {
  let email = req.body.email;
  let password = req.body.password;
  model
    .findOne({ email: email })
    .then((user) => {
      if (!user) {
        console.log("wrong email address");
        req.flash("error", "wrong email address")
        res.redirect("/users/login");
      } else {
        user.comparePassword(password).then((result) => {
          if (result) {
            req.session.user = user.id;
            req.flash("success", "You have successfully logged in!")
            res.redirect("/users/profile");
          } else {
            console.log(err);
            req.flash("error", "Wrong password")
            res.redirect("/users/login");
          }
        });
      }
    })
    .catch((err) => next(err));
};

//PROFILE
exports.profile = (req, res, next) => {
  let id = req.session.user;
  Promise.all([model.findById(id), item.find({ seller: id })])
    .then((results) => {
      const [user, items] = results;
      res.render("./users/profile", { user, items });
    })
    .catch((err) => next(err));
};

//LOGOUT
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err)
    } else {
      res.redirect("/");
    }
  });
};