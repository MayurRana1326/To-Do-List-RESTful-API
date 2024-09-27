const mongoose = require("mongoose");
const appConfig = require("../config/app.config");

const connectDB = () => mongoose.connect(appConfig.dbURL);
mongoose.set({ debug: true });

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully.");
});

mongoose.connection.on("error", () => {
  console.log("MongoDB disconnected connected.");
  process.exit(-1);
});

module.exports = connectDB;
