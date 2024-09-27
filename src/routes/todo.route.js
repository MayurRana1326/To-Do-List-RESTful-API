const express = require('express');
const router = express.Router();
const { validate } = require("express-validation");
const {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
} = require('../controllers/todo.controller');
const {
  getTodosSchema,
  getTodoByIdSchema,
  createTodoSchema,
  updateTodoSchema,
  deleteTodoSchema,
} = require('../validations/todo.validation');
const { verifyToken } = require("../middlewares/auth.middleware");

router.get('/', verifyToken, validate(getTodosSchema), getTodos);

router.get('/:id', verifyToken, validate(getTodoByIdSchema), getTodoById);

router.post('/', verifyToken, validate(createTodoSchema), createTodo);

router.put('/:id', verifyToken, validate(updateTodoSchema), updateTodo);

router.delete('/:id', verifyToken, validate(deleteTodoSchema), deleteTodo);

module.exports = router;
