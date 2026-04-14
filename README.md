# Task Manager — Fullstack REST API with Auth & RBAC

A production-ready task management application featuring JWT authentication, role-based access control (user/admin), versioned REST APIs, input validation, and a React frontend.

---

## Features

### Backend
- User registration and login with **bcrypt password hashing** and **JWT tokens**
- **Role-based access control** — users manage their own tasks, admins can view/manage all
- Full **CRUD API** for tasks (Create, Read, Update, Delete)
- **API versioning** (`/api/v1/...`) for future-proof endpoints
- **Input validation and sanitization** via `express-validator`
- **Rate limiting** on auth endpoints to prevent brute-force attacks
- **Helmet** for HTTP security headers
- **Morgan** for request logging
- **Swagger UI** auto-generated API documentation

### Frontend
- Built with **React + Vite**
- Register, login, and access a protected dashboard
- Create, toggle status, and delete tasks from the UI
- Displays success and error messages from API responses
- Role-aware UI — admins see all users' tasks with ownership labels

### Database
- **MongoDB** with Mongoose ODM
- Indexed schemas with validation constraints
- User schema: username (unique), email (unique), hashed password, role
- Task schema: title, description, status (pending/in-progress/completed), priority (low/medium/high), user reference

---

## Project Structure

```
backend/
├── config/
│   └── swagger.js           # Swagger/OpenAPI configuration
├── controllers/
│   ├── authController.js     # Register, login, getMe logic
│   └── taskController.js     # CRUD operations for tasks
├── middleware/
│   ├── authMiddleware.js     # JWT verification & role-check middleware
│   └── validate.js           # express-validator rules and error handler
├── models/
│   ├── User.js               # Mongoose user schema
│   └── Task.js               # Mongoose task schema
├── routes/v1/
│   ├── authRoutes.js         # Auth endpoints with Swagger annotations
│   └── taskRoutes.js         # Task endpoints with Swagger annotations
├── server.js                 # App entry point
├── .env.example              # Required environment variables
└── package.json

frontend/
├── src/
│   ├── config/api.js         # Centralized API base URL
│   ├── context/AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   └── index.css
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### Backend
```bash
cd backend
cp .env.example .env        # Edit .env and set your JWT_SECRET
npm install
npm run dev                 # Starts on http://localhost:5000
```

API docs available at: **http://localhost:5000/api-docs**

### Frontend
```bash
cd frontend
npm install
npm run dev                 # Starts on http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint              | Access  | Description                |
|--------|-----------------------|---------|----------------------------|
| POST   | `/api/v1/auth/register` | Public  | Register a new user         |
| POST   | `/api/v1/auth/login`    | Public  | Login and receive JWT       |
| GET    | `/api/v1/auth/me`       | Private | Get current user profile    |
| GET    | `/api/v1/tasks`         | Private | Get user's tasks            |
| GET    | `/api/v1/tasks/:id`     | Private | Get a single task           |
| POST   | `/api/v1/tasks`         | Private | Create a task               |
| PUT    | `/api/v1/tasks/:id`     | Private | Update a task               |
| DELETE | `/api/v1/tasks/:id`     | Private | Delete a task               |

---

## Scalability & Deployment Notes

This project is structured to scale smoothly as traffic and complexity grow:

1. **Microservices**: The auth and task modules are already decoupled through separate routes, controllers, and models. They can be extracted into independent services communicating via HTTP or a message queue (e.g., RabbitMQ).

2. **Caching (Redis)**: Frequently-read data like task lists can be cached in Redis with a short TTL. This reduces MongoDB load significantly under high read volume.

3. **Load Balancing**: Deploying multiple backend instances behind Nginx or an AWS ALB distributes traffic evenly and provides failover.

4. **Containerization**: Both frontend and backend can be Dockerized. A `docker-compose.yml` would spin up the API, MongoDB, and Redis in one command. Kubernetes handles auto-scaling in production.

5. **Rate Limiting & Security**: Already implemented with `express-rate-limit` and `helmet`. In production, add HTTPS and environment-specific CORS origins.

---

## License

MIT
