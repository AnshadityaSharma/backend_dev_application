const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const setupSwagger = require('./config/swagger');

// Load env vars before anything else
dotenv.config();

const app = express();

// --- Security middleware ---
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// Rate limiter on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    message: { message: 'Too many requests from this IP. Try again in 15 minutes.' }
});

// --- Route imports ---
const authRoutes = require('./routes/v1/authRoutes');
const taskRoutes = require('./routes/v1/taskRoutes');

// --- API versioned routes ---
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// Swagger docs
setupSwagger(app);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Task Manager API is running',
        docs: '/api-docs'
    });
});

// --- Global error handling middleware ---
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error'
    });
});

// --- Database connection and server startup ---
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI || 'mongodb://127.0.0.1:27017/backend_dev_db';

mongoose.set('strictQuery', false);

mongoose.connect(DB_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log(`API docs at http://localhost:${PORT}/api-docs`);
        });
    })
    .catch((err) => {
        console.error('---------------------------------------------------');
        console.error('DATABASE CONNECTION FAILED');
        console.error('---------------------------------------------------');
        console.error('Could not connect to MongoDB at:', DB_URI);
        console.error('');
        console.error('Make sure MongoDB is running. Options:');
        console.error('  1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
        console.error('  2. Use MongoDB Atlas (free): https://cloud.mongodb.com');
        console.error('     Then update DB_URI in backend/.env');
        console.error('---------------------------------------------------');
        process.exit(1);
    });
