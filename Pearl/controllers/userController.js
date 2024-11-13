exports.new = (req, res) => {
  res.render("./users/new");
};

exports.login = (req, res) => {
  res.render("./users/login");
};

exports.profile = (req, res) => {
  res.render("./users/profile");
};
