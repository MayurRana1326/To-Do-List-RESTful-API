const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app/app");
const Todo = require("../models/todo.model");
const User = require("../models/users.model");
const jwt = require("jsonwebtoken");

beforeAll(async () => {
  const mongoUri = "mongodb://localhost:27017/to-do-list-test-api";
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await Todo.deleteMany({});
  await User.deleteMany({});

  const user = await User.create({
    firstName: "Test",
    lastName: "User",
    email: "test@example.com",
    password: "password",
  });

  const loginResponse = await request(app).post("/api/auth/login").send({
    email: "test@example.com",
    password: "password",
  });

  this.userToken = loginResponse.body.data.token;
  this.userId = user._id;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Todo API Tests with Validations", () => {
  test("should return error if token is invalid", async () => {
    const invalidToken = jwt.sign({ id: "fakeUserId" }, "wrongSecret");

    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${invalidToken}`);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token.");
  });

  test("should create a new todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${this.userToken}`)
      .send({
        title: "Test Todo",
        description: "This is a test todo",
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Todo created successfully.");
  });

  test("should return error if title is missing when creating a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${this.userToken}`)
      .send({
        // Missing 'title'
        description: "This is a test todo",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"title" is required');
  });

  test("should return error if description is missing when creating a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${this.userToken}`)
      .send({
        title: "Test Todo",
        // Missing 'description'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('"description" is required');
  });

  test("should return error if fields are empty when creating a todo", async () => {
    const res = await request(app)
      .post("/api/todos")
      .set("Authorization", `Bearer ${this.userToken}`)
      .send({
        title: "",
        description: "",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(
      expect.stringContaining("is not allowed to be empty")
    );
  });

  test("should return error if invalid ID is passed when fetching a todo", async () => {
    const res = await request(app)
      .get(`/api/todos/invalid-id`)
      .set("Authorization", `Bearer ${this.userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Invalid ObjectId format. It should be a hexadecimal string."
    );
  });

  test("should return error if invalid ID is passed when updating a todo", async () => {
    const res = await request(app)
      .put(`/api/todos/invalid-id`)
      .set("Authorization", `Bearer ${this.userToken}`)
      .send({ title: "Updated Todo Title" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Invalid ObjectId format. It should be a hexadecimal string."
    );
  });

  test("should return error if invalid ID is passed when deleting a todo", async () => {
    const res = await request(app)
      .delete(`/api/todos/invalid-id`)
      .set("Authorization", `Bearer ${this.userToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Invalid ObjectId format. It should be a hexadecimal string."
    );
  });

  test("should fetch all todos", async () => {
    await Todo.create({
      title: "Test Todo 1",
      description: "Todo 1 description",
      user: this.userId,
    });
    await Todo.create({
      title: "Test Todo 2",
      description: "Todo 2 description",
      user: this.userId,
    });

    const res = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${this.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(2);
  });

  test("should fetch a todo by ID", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      description: "Todo description",
      user: this.userId,
    });

    const res = await request(app)
      .get(`/api/todos/${todo._id}`)
      .set("Authorization", `Bearer ${this.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(todo._id.toString());
  });

  test("should update a todo", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      description: "Todo description",
      user: this.userId,
    });

    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .set("Authorization", `Bearer ${this.userToken}`)
      .send({ title: "Updated Todo Title" });

    expect(res.status).toBe(200);
    expect(res.body.data.title).toBe("Updated Todo Title");
  });

  test("should delete a todo", async () => {
    const todo = await Todo.create({
      title: "Test Todo",
      description: "Todo description",
      user: this.userId,
    });

    const res = await request(app)
      .delete(`/api/todos/${todo._id}`)
      .set("Authorization", `Bearer ${this.userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Todo deleted successfully.");
  });
});
