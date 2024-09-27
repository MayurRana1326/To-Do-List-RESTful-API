const authRouter = require("express").Router();
const { signup, login } = require("../controllers/auth.controller");
const { validate } = require("express-validation");
const { signupSchema, loginSchema } = require('../validations/auth.validation');

authRouter.post("/signup", validate(signupSchema), signup);
authRouter.post("/login", validate(loginSchema), login);

module.exports = authRouter;
