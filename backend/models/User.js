const mongoose = require('mongoose');

// We are defining the structure of a User document in MongoDB.
// Think of it as a blueprint for what user data we store.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', // Most folks signing up will just be normal users
    }
}, { timestamps: true }); // Mongoose automagically adds createdAt and updatedAt fields!

const User = mongoose.model('User', userSchema);
module.exports = User;
