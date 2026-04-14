const Task = require('../models/Task');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private (Logged in users only)
const getTasks = async (req, res) => {
    try {
        let tasks;
        
        // Let's implement a little role-based access! 
        // If an admin requests tasks, maybe they want to see all tasks? 
        // But for this use-case, let's say admins can see everything, regular users only see theirs.
        if (req.user.role === 'admin' && req.query.all === 'true') {
            tasks = await Task.find({}).populate('user', 'username');
        } else {
            // Normal user (or admin just checking their own)
            tasks = await Task.find({ user: req.user.id });
        }
        
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Fetch tasks error:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: 'A task must have a title!' });
        }

        // We tie the new task to the user ID provided by our auth middleware
        const task = await Task.create({
            title,
            description,
            user: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ message: 'Error creating the task' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Security check: ensure the logged-in user owns the task, or is an admin!
        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to edit this task' });
        }

        // Perform the update
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // Returns the updated document rather than the old one
        );

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Same permission check as update
        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You do not have permission to delete this task' });
        }

        await task.deleteOne();

        // Let the client know it was successfully removed
        res.status(200).json({ id: req.params.id, message: 'Task removed successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
