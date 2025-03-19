const express = require("express");
const controller = require("../controllers/offerController");
const router = express.Router({ mergeParams: true });
const { isGuest, isSeller, isLoggedIn } = require("../middlewares/auth");

//GET /items/:id/offers/ returns offers
router.get("/", isLoggedIn, controller.index);

router.post("/", isLoggedIn, controller.create);

router.post("/:offerId/accept", isLoggedIn, isSeller, controller.update);

module.exports = router;
