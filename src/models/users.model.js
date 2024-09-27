const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const appConfig = require("./../config/app.config");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre(/save/, async function (next) {
  const newPassword = this.password;
  const hashedPassword = await bcrypt.hash(newPassword, appConfig.salt);
  this.password = hashedPassword;
  next();
});

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("Users", userSchema);
