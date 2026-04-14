# Fullstack Task Master Application 🚀

Welcome to our fullstack Task Management Application! Built with a solid Node.js/Express backbone and a snazzy React frontend, it's designed to manage your tasks beautifully and securely.

## 🌟 Highlights
- **Sturdy Backend API**: Node.js + Express with MongoDB.
- **Secure Authentication**: We use JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Role-Based Access Control**:
  - `user`: Can create, edit, view, and delete their *own* tasks.
  - `admin`: Superpowers! Can see tasks created by *anyone*.
- **Premium Frontend UI**: A sleek, dark-themed React application built with Vanilla CSS for an amazing user experience.
- **Auto-Generated Documentation**: Swagger UI integrated natively.

## 🛠 Tech Stack
- **Database**: MongoDB (via Mongoose)
- **Backend API**: Express.js, Node.js
- **Security**: jsonwebtoken, bcryptjs, cors
- **Frontend App**: React, Vite, Axios, React Router v6

---

## 🚀 Getting Started

### 1️⃣ Clone and Setup
Make sure you have Node.js and MongoDB running.

### 2️⃣ Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the necessary packages:
   ```bash
   npm install
   ```
3. Set your environment variables in `backend/.env`:
   ```env
   PORT=5000
   DB_URI=mongodb://127.0.0.1:27017/backend_dev_db
   JWT_SECRET=super_secret_jwt_key_that_should_be_long_and_complex
   ```
4. Fire it up!
   ```bash
   npm run dev
   ```

*(Your Swagger API Documentation will be live at `http://localhost:5000/api-docs` !)*

### 3️⃣ Frontend Setup
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install those dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

---

## 📈 Scalability Note 

As this application grows, here is how we would scale it up to handle intense traffic:

1. **Microservices Architecture**: We could break out "Authentication" and "Task Management" into own dedicated services. This way, if only tasks are receiving huge traffic, we can just spin up more instances of the task service without touching the auth service.
2. **Caching Strategy with Redis**: Often users request the exact same static data repeatedly (like reading their tasks). Putting Redis between the Express app and MongoDB would keep the latest tasks in memory, drastically reducing the database load.
3. **Load Balancing**: Using Nginx or AWS Application Load Balancer to distribute incoming traffic evenly across multiple instances of our backend server.
4. **Containerization (Docker & Kubernetes)**: Dockerizing both the frontend and backend would make deployments bulletproof. Orchestrating them with Kubernetes would auto-heal failing nodes and scale up resources during peak hours.

Enjoy building and exploring!
