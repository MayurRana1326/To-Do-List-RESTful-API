# Todo Management RESTful API

This is a RESTful API built with Node.js and Express.js for managing todo lists. It allows users to perform CRUD (Create, Read, Update, Delete) operations on todos, with optional features like data validation, pagination, and authentication.

## Features

- Retrieve all todos for the logged-in user.
- Retrieve details of a specific todo by its ID.
- Add a new todo to the list.
- Update details of an existing todo.
- Delete a todo from the list.
- Data validation using Joi.
- Pagination for listing todos.
- User authentication.
- Unit testing using Jest.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MayurRana1326/To-Do-List-RESTful-API.git
   cd todo-api
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a .env file for environment variables (such as database configuration, JWT secret for authentication, etc.).  
   **Example:**
   ```
   PORT=3000
   DB_URL=mongodb://localhost:27017/to-do-api
   JWT_SECRET=yourjwtsecret
   SALT=10
   ```

4. Start the application:
   ```bash
   npm start
   ```

## Running Tests

To run the test cases for the API, use the following command:

```bash
npm test
```

To check code coverage while running tests, use:

```bash
npm test -- --coverage
```

This will execute all the test cases and generate a coverage report, which you can find in the `coverage` directory. Open `index.html` in your browser to view the detailed coverage report.

## API Reference for Authentication

1. Sign up:
   ```http
   POST /api/auth/signup
   ```

   | Body Parameter | Type     | Description                    |
   | :--------      | :------- | :----------------------------- |
   | `firstName`    | `string` | **Required**. First name of the user |
   | `lastName`     | `string` | **Required**. Last name of the user |
   | `email`        | `string` | **Required**. Email of the user |
   | `password`     | `string` | **Required**. Password of the user |

2. Login:
   ```http
   POST /api/auth/login
   ```

   | Body Parameter | Type     | Description                    |
   | :--------      | :------- | :----------------------------- |
   | `email`        | `string` | **Required**. Email of the user |
   | `password`     | `string` | **Required**. Password of the user |

## API Reference for Todos

1. Retrieve all todos:
   ```http
   GET /api/todos
   ```

   | Query Parameter | Type     | Description                |
   | :--------       | :------- | :------------------------- |
   | `skip`          | `Number` | **Optional**. For Pagination |
   | `limit`         | `Number` | **Optional**. For Pagination |

2. Get todo details:
   ```http
   GET /api/todos/${id}
   ```

   | Parameter | Type     | Description                       |
   | :-------- | :------- | :-------------------------------- |
   | `id`      | `string` | **Required**. ID of the todo to fetch |

3. Add a new todo:
   ```http
   POST /api/todos
   ```

   | Body Parameter | Type     | Description                    |
   | :--------      | :------- | :----------------------------- |
   | `title`        | `string` | **Required**. Title of the todo |
   | `description`  | `string` | **Optional**. Description of the todo |
   | `state`        | `string` | **Required**. State of the todo (e.g., "incomplete", "completed") |

4. Update todo details:
   ```http
   PUT /api/todos/${id}
   ```

   | Parameter | Type     | Description                       |
   | :-------- | :------- | :-------------------------------- |
   | `id`      | `string` | **Required**. ID of the todo to update |

   | Body Parameter | Type     | Description                    |
   | :--------      | :------- | :----------------------------- |
   | `title`        | `string` | **Optional**. Title of the todo |
   | `description`  | `string` | **Optional**. Description of the todo |
   | `state`        | `string` | **Optional**. State of the todo |

5. Delete todo:
   ```http
   DELETE /api/todos/${id}
   ```

   | Parameter | Type     | Description                       |
   | :-------- | :------- | :-------------------------------- |
   | `id`      | `string` | **Required**. ID of the todo to delete |
