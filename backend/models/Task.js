const mongoose = require('mongoose');

// The blueprint for a Task
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Task needs a title'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    // We link the task to the user who created it.
    // This helps in fetching only the tasks belonging to the logged-in user.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
