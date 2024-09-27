const Todo = require("./../models/todo.model");
const { getSuccessResponse } = require("../utils/response.util");

/**
 * Get all todos for the logged-in user.
 * 
 * This function retrieves all todos associated with the authenticated user's ID
 * from the request. It supports pagination through skip and limit query parameters.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.getTodos = async (req, res, next) => {
  try {
    const { skip, limit } = req.query;
    const userId = req.user._id; // Extract user ID from the JWT token
    const todos = await Todo.find({ user: userId }).skip(Number(skip) || 0).limit(Number(limit) || 20);
    return res.status(200).json(getSuccessResponse("User's todos fetched successfully.", todos));
  } catch (error) {
    next(error);
  }
};

/**
 * Get a todo by ID for the logged-in user.
 * 
 * This function retrieves a specific todo based on its ID and the authenticated user's ID.
 * If the todo does not exist, a 404 error response is returned.
 * 
 * @param {Object} req - The HTTP request object containing the todo ID in params.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.getTodoById = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const todo = await Todo.findOne({ _id: req.params.id, user: userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json(getSuccessResponse("Todo details fetched successfully.", todo));
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new todo for the logged-in user.
 * 
 * This function creates a new todo using the data provided in the request body,
 * associating it with the authenticated user's ID.
 * 
 * @param {Object} req - The HTTP request object containing todo details in the body.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.createTodo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const newTodo = await Todo.create({ ...req.body, user: userId });
    return res.status(201).json(getSuccessResponse("Todo created successfully.", newTodo));
  } catch (error) {
    next(error);
  }
};

/**
 * Update a todo for the logged-in user.
 * 
 * This function updates an existing todo based on its ID and the authenticated user's ID.
 * If the todo does not exist, a 404 error response is returned.
 * 
 * @param {Object} req - The HTTP request object containing the todo ID in params and updated data in body.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.updateTodo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updatedTodo = await Todo.findOneAndUpdate({ _id: req.params.id, user: userId }, req.body, { new: true });
    if (!updatedTodo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json(getSuccessResponse("Todo updated successfully.", updatedTodo));
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a todo for the logged-in user.
 * 
 * This function deletes a specific todo based on its ID and the authenticated user's ID.
 * If the todo does not exist, a 404 error response is returned.
 * 
 * @param {Object} req - The HTTP request object containing the todo ID in params.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} next - The next middleware function for error handling.
 */
exports.deleteTodo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: userId });
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    return res.status(200).json(getSuccessResponse("Todo deleted successfully.", todo));
  } catch (error) {
    next(error);
  }
};
