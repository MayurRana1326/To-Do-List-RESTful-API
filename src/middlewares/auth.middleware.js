const User = require("./../models/users.model");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/app.config");
const { getFailureResponse } = require("../utils/response.util");

/**
 * Middleware to verify JWT token for authentication.
 * 
 * This function extracts the token from the 'Authorization' header,
 * verifies its validity, checks if the user associated with the token exists,
 * and attaches the user object to the request object for further use in the request lifecycle.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * 
 * @throws {Error} - Returns 401 status if the token is invalid, expired, or if the user does not exist.
 */
exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res
        .status(401)
        .json(getFailureResponse("Access denied. No token provided."));

    const decoded = jwt.verify(token, appConfig.jwtSecret);
    const { email } = decoded;
    const user = await User.findOne({ email });

    if (!user)
      return res
        .status(401)
        .json(getFailureResponse("Invalid token. User no longer exists."));

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json(getFailureResponse("Session expired. Please log in again."));
    } else {
      return res.status(401).json(getFailureResponse("Invalid token."));
    }
  }
};
