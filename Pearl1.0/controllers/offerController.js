const Offer = require("../models/offer");
const Item = require("../models/item");
const mongoose = require("mongoose");

//GET /get all the offers on an item
exports.index = (req, res, next) => {
  let itemId = req.params.id;

  Item.findById(itemId).then((item) => {
    if (!item) {
      let err = new Error("Item not found");
      err.status = 404;
      return next(err);
    }
    Offer.find({ item: itemId })
      .populate("user", "firstName LastName")
      .then((offers) => {
        res.render("../views/offers/offers", { item, offers });
      })
      .catch((err) => next(err));
  });
};

//POST /creating a new offer
exports.create = (req, res, next) => {
  let id = req.params.id;

  Item.findById(id)
    .then((item) => {
      if (!item) {
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      let offer = new Offer({
        ...req.body,
        item: item.id,
        user: req.session.user,
      });

      return offer
        .save()
        .then(() => {
          return Item.findByIdAndUpdate(id, {
            $inc: { totalOffers: 1 },
            $max: { highestOffer: offer.amount },
          });
        })
        .then(() => {
          req.flash("success", "Offer was made");
          res.redirect("/items/" + id);
        });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    });
};

//PUT /update all offers to rejected or accepted
exports.update = (req, res, next) => {
  let itemId = req.params.id;
  let offerId = req.params.offerId;

  if (
    !mongoose.Types.ObjectId.isValid(itemId) ||
    !mongoose.Types.ObjectId.isValid(offerId)
  ) {
    let err = new Error("Invalid item or offer ID");
    err.status = 400;
    return next(err);
  }

  Item.findById(itemId)
    .then((item) => {
      if (!item) {
        let err = new Error("Item not found");
        err.status = 404;
        return next(err);
      }
      return Item.findByIdAndUpdate(itemId, { active: false }, { new: true });
    })
    .then((updatedItem) => {
      if (!updatedItem) {
        const err = new Error("Failed to update item status");
        err.status = 500;
        return next(err);
      }
      return Offer.findByIdAndUpdate(
        offerId,
        { status: "accepted" },
        { new: true }
      );
    })
    .then((acceptedOffer) => {
      if (!acceptedOffer) {
        let err = new Error("Offer not found");
        err.status = 404;
        return next(err);
      }
      return Offer.updateMany(
        { item: itemId, _id: { $ne: offerId } },
        { status: "rejected" }
      );
    })
    .then(() => {
      res.redirect("/items/" + itemId + "/offers");
    })
    .catch((err) => next(err));
};
