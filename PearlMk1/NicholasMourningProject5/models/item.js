const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  title: { type: String, required: [true, "title is required"] },
  seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
  condition: {
    type: String,
    enum: [
      "Used",
      "Used - good condition",
      "Used - like new",
      "Refurbished",
      "New",
      "New - without tags",
      "New - with tags",
    ],
    required: true,
  },
  price: { type: Number, required: true, min: 0.01 },
  totalOffers: { type: Number, default: 0 },
  highestOffer: { type: Number, default: 0 },
  details: { type: String, required: [true, "details are required"] },
  image: { type: String, required: [true, "image is required"] },
  active: { type: Boolean, default: true },
  offers: { type: Schema.Types.ObjectId, ref: "Offer" },
});

//Export the model
module.exports = mongoose.model("Item", itemSchema);
