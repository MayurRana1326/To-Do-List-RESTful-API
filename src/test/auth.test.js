const request = require('supertest');
const app = require('../app/app');
const User = require('../models/users.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

beforeAll(async () => {
  const mongoUri = 'mongodb://localhost:27017/to-do-list-test-api';
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Authentication API Tests', () => {
  test('should register a new user', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
    });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully.");
  });

  test('should log in an existing user', async () => {
    const signupRes = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
    });
    // console.log("🚀 ~ signupRes ~ signupRes:=============", signupRes.body)

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
  });
});

describe('Additional Authentication API Tests', () => {

  test('should not register a user with an already registered email', async () => {
    // First registration
    await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'duplicate@example.com',
      password: 'password',
    });

    // Attempt to register again with the same email
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'duplicate@example.com',
      password: 'password',
    });

    expect(res.status).toBe(409); // Or whatever status code is appropriate for your app
    expect(res.body.message).toBe("Email already exists.");
  });

  test('should not register a user with missing fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      // Missing lastName and other fields
      email: 'incomplete@example.com',
      password: 'password',
    });

    expect(res.status).toBe(400); // Bad Request
    expect(res.body.message).toEqual(expect.stringContaining("required")); 
  });

  test('should not log in with incorrect password', async () => {
    await request(app).post('/api/auth/signup').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid Credentials.");
  });

  test('should not log in with non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'password',
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found.");
  });

});
