const User = require("./../models/users.model");
const jwt = require("jsonwebtoken");
const appConfig = require("../config/app.config");
const {
  getSuccessResponse,
  getFailureResponse,
} = require("../utils/response.util");

/**
 * Handles user signup.
 *
 * This function checks if a user with the provided email already exists. If not,
 * it creates a new user with the provided details and responds with a success message.
 *
 * @param {Object} req - The HTTP request object containing user details in the body.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.signup = async (req, res, next) => {
  try {
    const payload = req.body;

    const isUserExist = await User.findOne({
      email: payload.email,
    });
    if (isUserExist)
      return res.status(409).json(getFailureResponse("Email already exists."));

    await User.create(payload);

    return res
      .status(201)
      .json(getSuccessResponse("User registered successfully."));
  } catch (error) {
    next(error);
  }
};

/**
 * Handles user login.
 *
 * This function verifies the provided email and password, and if valid, generates
 * a JWT token for the authenticated user and responds with the token.
 *
 * @param {Object} req - The HTTP request object containing email and password in the body.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json(getFailureResponse("User not found."));

    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched)
      return res.status(401).json(getFailureResponse("Invalid Credentials."));

    const tokenPayload = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    const token = jwt.sign(tokenPayload, appConfig.jwtSecret, {
      expiresIn: "1d",
    });

    return res.status(200).json(
      getSuccessResponse("User logged in successfully.", {
        token,
      })
    );
  } catch (error) {
    next(error);
  }
};
