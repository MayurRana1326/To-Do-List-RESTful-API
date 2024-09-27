require("dotenv").config();

module.exports = {
  port: process.env.PORT,
  dbURL: process.env.DB_URL,
  salt: +process.env.SALT,
  jwtSecret: process.env.JWT_SECRET,
};
