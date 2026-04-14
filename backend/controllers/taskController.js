const Task = require('../models/Task');

/**
 * @desc    Get tasks — users see their own, admins can see all
 * @route   GET /api/v1/tasks
 * @access  Private
 */
const getTasks = async (req, res) => {
    try {
        let filter = { user: req.user.id };

        // Admins can pass ?all=true to view every user's tasks
        if (req.user.role === 'admin' && req.query.all === 'true') {
            filter = {};
        }

        const tasks = await Task.find(filter)
            .populate('user', 'username email')
            .sort({ createdAt: -1 });

        res.status(200).json({ count: tasks.length, tasks });
    } catch (error) {
        console.error('Get tasks error:', error.message);
        res.status(500).json({ message: 'Failed to retrieve tasks.' });
    }
};

/**
 * @desc    Get a single task by ID
 * @route   GET /api/v1/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('user', 'username email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Only the owner or an admin can view the task
        if (task.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error('Get task error:', error.message);
        res.status(500).json({ message: 'Failed to retrieve the task.' });
    }
};

/**
 * @desc    Create a new task
 * @route   POST /api/v1/tasks
 * @access  Private
 */
const createTask = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const task = await Task.create({
            title,
            description,
            priority,
            user: req.user.id,
        });

        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error.message);
        res.status(500).json({ message: 'Failed to create task.' });
    }
};

/**
 * @desc    Update an existing task
 * @route   PUT /api/v1/tasks/:id
 * @access  Private (owner or admin)
 */
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only update your own tasks.' });
        }

        // Only allow updating specific fields
        const allowedFields = ['title', 'description', 'status', 'priority'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
            new: true,
            runValidators: true,
        });

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Update task error:', error.message);
        res.status(500).json({ message: 'Failed to update task.' });
    }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/v1/tasks/:id
 * @access  Private (owner or admin)
 */
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'You can only delete your own tasks.' });
        }

        await task.deleteOne();
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (error) {
        console.error('Delete task error:', error.message);
        res.status(500).json({ message: 'Failed to delete task.' });
    }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
