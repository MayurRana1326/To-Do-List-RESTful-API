const express = require("express");
const morgan = require('morgan');
const { mainErrorHandler, notFoundError } = require("../middlewares/error.middleware");
const { getSuccessResponse } = require("./../utils/response.util");
const indexRouter = require("./../routes/index.route");

const app = express();

/**
 * Middleware stack
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))

/** Health check API */
app.get("/healthCheck", (req, res, next) => {
  try {
    return res.status(200).json(getSuccessResponse("Server is working fine."));
  } catch (error) {
    next(error);
  }
});


/**
 * API Routes
 */
app.use('/api', indexRouter);

/**
 * Error handling
 */
app.use(notFoundError);
app.use(mainErrorHandler);

module.exports = app;
