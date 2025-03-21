const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

//User Schema
const userSchema = new Schema({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  email: {
    type: String,
    required: [true, "email adress is required"],
    unique: [true, "This email address has been used"],
  },
  password: { type: String, required: [true, "Password is required"] },
  offers: [{ type: Schema.Types.ObjectId, ref: "Offer" }],
});

//Encrypt Password
userSchema.pre("save", function (next) {
  let user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

//Compare Passwords
userSchema.methods.comparePassword = function (inputPassword) {
  let user = this;
  return bcrypt.compare(inputPassword, user.password);
};

//Export User
module.exports = mongoose.model("User", userSchema);
