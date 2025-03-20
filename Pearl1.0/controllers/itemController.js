const model = require("../models/item");
const multer = require("multer");
const path = require("path");

//Show items Page
exports.index = (req, res) => {
  model
    .find()
    .sort({ price: 1 })
    .then((items) => res.render("../views/items/index", { items }))
    .catch((err) => next(err));
};

//GET /items/new: send html form for creating a new item
exports.new = (req, res) => {
  res.render("./items/new");
};

//File uploader

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const mimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/jpg",
    "image/webp",
  ];
  if (mimeTypes.includes(file.mimetype)) {
    return cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only jpeg, png, gif, jpg, and webp image files are allowed"
      ),
      false
    );
  }
};

exports.upload = multer({ storage, fileFilter }).single("image");

//GET /items/search: search for item name or details and returns item page
exports.searchItems = async (req, res) => {
  try {
    const searchedTerm = req.query.s.toLowerCase();

    let foundItems = await model.find({
      $or: [
        { title: { $regex: searchedTerm } },
        { details: { $regex: searchedTerm, $options: "i" } },
      ],
    });
    res.render("items/index", { items: foundItems });
  } catch {
    next(err);
  }
};

//Post /items: create a new item
exports.create = (req, res, next) => {
  let item = new model(req.body);

  item.image = "/images/" + req.file.filename;
  item.seller = req.session.user;

  item
    .save()
    .then(() => {
      req.flash("success", "Item up for sell");
      res.redirect("/items");
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//SHOW certain item

exports.show = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid item id");
    err.status = 400;
    return next(err);
  }
  model
    .findById(id)
    .populate("seller", "firstName lastName")
    .then((item) => {
      if (item) {
        const active = item.active;
        res.render("../views/items/show", { item, active });
      } else {
        let err = new Error("Cannot find a item with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//EDIT a item

exports.edit = (req, res, next) => {
  let id = req.params.id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid item id");
    err.status = 400;
    return next(err);
  }
  model
    .findById(id)
    .then((item) => {
      if (item) {
        res.render("../views/items/edit", { item });
      } else {
        let err = new Error("Cannot find a item with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => next(err));
};

//UPDATE an item

exports.update = (req, res, next) => {
  let id = req.params.id;
  let item = req.body;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid item id");
    err.status = 400;
    return next(err);
  }

  existingItem = model.findById(id);

  if (req.file) {
    item.image = "/images/" + req.file.filename;
  } else {
    item.image = existingItem.image;
  }

  model
    .findByIdAndUpdate(id, item, {
      useFindAndModify: false,
      runValidators: true,
    })
    .then((item) => {
      if (item) {
        req.flash("success", "You have edited an item!");
        res.redirect("/items/" + id);
      } else {
        let err = new Error("Cannot find a item with id " + id);
        err.status = 404;
        next(err);
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//DELETE an item

exports.delete = (req, res, next) => {
  let id = req.params.id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    let err = new Error("Invalid item id");
    err.status = 400;
    return next(err);
  }

  model
    .findByIdAndDelete(id, { useFindAndModify: false, runValidators: true })
    .then((item) => {
      if (item) {
        req.flash("success", "You have deleted an item!");
        res.redirect("/items");
      } else {
        let err = new Error("Cannot find a story with id " + id);
        err.status = 404;
        next(err);
      }
    });
};
