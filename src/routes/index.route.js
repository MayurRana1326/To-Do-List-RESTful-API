const indexRouter = require("express").Router();

const authRouter = require("./auth.route");
const todoRouter = require("./todo.route");

indexRouter.use("/auth", authRouter);
indexRouter.use("/todos", todoRouter);

module.exports = indexRouter;
