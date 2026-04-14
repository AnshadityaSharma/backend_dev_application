const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables early on
dotenv.config();

// Initialize the express app
const app = express();

// Middleware setup
app.use(cors()); // Allow cross-origin requests from our frontend
app.use(express.json()); // Parse incoming JSON payloads

// Import our routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Import Swagger for documentation
const setupSwagger = require('./swagger');

// Mount routes
// Everything related to auth (login, register) goes under /api/auth
app.use('/api/auth', authRoutes);
// Task management goes under /api/tasks
app.use('/api/tasks', taskRoutes);

// Setup Swagger UI
setupSwagger(app);

// Keep a simple health-check route just to make sure the server is alive
app.get('/', (req, res) => {
    res.json({ message: 'API is running successfully!' });
});

// Setup database connection
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/backend_dev_db';

mongoose.connect(DB_URI)
    .then(() => {
        console.log('Connected to MongoDB database');
        // Once connected, start listening for requests
        app.listen(PORT, () => {
            console.log(`Server is up and running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to the database', err);
    });
