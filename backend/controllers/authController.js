const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A helper function to generate a JWT token
// The payload will contain the user id and their role
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // let's keep them logged in for 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validation - ensure we got everything
        if (!username || !password) {
            return res.status(400).json({ message: 'Please provide both username and password' });
        }

        // Check if a user with that name already exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists, try another username' });
        }

        // Hash the password before saving for security!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user record in the DB
        const user = await User.create({
            username,
            password: hashedPassword,
            role: role || 'user', // Defaults to 'user', but allow passing 'admin' for testing
        });

        if (user) {
            // Success! Send back basic user info and their new shiny token
            return res.status(201).json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        }
    } catch (error) {
        // Log the error internally and let the user know something broke
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server fell over during registration. Oops.' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Make sure they gave us both fields
        if (!username || !password) {
            return res.status(400).json({ message: 'Need both username and password to log in!' });
        }

        // Find the user by their username
        const user = await User.findOne({ username });

        // If user exists, check if the provided password matches the hashed one in DB
        if (user && (await bcrypt.compare(password, user.password))) {
            return res.json({
                _id: user._id,
                username: user.username,
                role: user.role,
                token: generateToken(user._id, user.role),
            });
        } else {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server had an issue while trying to log you in.' });
    }
};

module.exports = { registerUser, loginUser };
