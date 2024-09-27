const Joi = require("joi");
const ObjectId = require("./objectId.validation"); // Assuming ObjectId is a custom validation for MongoDB ObjectIds

// Validation schema for creating a new To-Do item
const createTodoSchema = {
  body: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(500).required(),
    state: Joi.string().valid('completed', 'incomplete').default('incomplete'),
  }),
};

// Validation schema for updating an existing To-Do item
const updateTodoSchema = {
  params: Joi.object({
    id: ObjectId, // Ensure the ID is a valid ObjectId
  }),
  body: Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().min(3).max(500).optional(),
    state: Joi.string().valid('completed', 'incomplete').optional(),
  }),
};

// Validation schema for querying To-Do items (pagination)
const getTodosSchema = {
  query: Joi.object({
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

// Validation schema for fetching a single To-Do item by its ID
const getTodoByIdSchema = {
  params: Joi.object({
    id: ObjectId, // Ensure the ID is a valid ObjectId
  }),
};

// Validation schema for deleting a To-Do item by its ID
const deleteTodoSchema = {
  params: Joi.object({
    id: ObjectId, // Ensure the ID is a valid ObjectId
  }),
};

module.exports = {
  createTodoSchema,
  updateTodoSchema,
  getTodosSchema,
  getTodoByIdSchema,
  deleteTodoSchema,
};
