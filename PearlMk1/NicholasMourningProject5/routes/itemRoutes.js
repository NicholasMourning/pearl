const express = require("express");
const controller = require("../controllers/itemController");
const router = express.Router();
const offerRoutes = require("./offerRoutes");
const { isLoggedIn, isSeller } = require("../middlewares/auth");
const { validateResult, validateItem } = require("../middlewares/validator");

//GET /items : send all items to the user
router.get("/", controller.index);

//GET /search : send request for item
router.get("/search", controller.searchItems);

//GET /items/new : send form for creating a new item
router.get("/new", isLoggedIn, controller.new);

//POST /items : create a new item
router.post("/", isLoggedIn, controller.upload, controller.create);

//GET /items/:id : send details of a item identified by id
router.get("/:id", isLoggedIn, controller.show);

//GET /items/:id/edit : send form for editing an existing item
router.get("/:id/edit", isLoggedIn, isSeller, controller.edit);

//PUT /items/:id : update the item identified by id
router.put(
  "/:id",
  isLoggedIn,
  isSeller,
  validateItem,
  validateResult,
  controller.upload,
  controller.update
);

//DELETE /items:id : delete the item identified by id
router.delete("/:id", isLoggedIn, isSeller, controller.delete);

router.use("/:id/offers", offerRoutes);

module.exports = router;
