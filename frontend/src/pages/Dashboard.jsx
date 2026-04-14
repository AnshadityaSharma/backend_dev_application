import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit2, LogOut, CheckCircle, Circle } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch tasks when the component loads
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            // Admins can see all tasks by adding ?all=true
            const url = user.role === 'admin' 
                ? 'http://localhost:5000/api/tasks?all=true' 
                : 'http://localhost:5000/api/tasks';
                
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setTasks(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch tasks.');
            setLoading(false);
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await axios.post('http://localhost:5000/api/tasks', 
                { title, description },
                { headers: { Authorization: `Bearer ${user.token}` }}
            );
            // Add the new task to our state without refreshing the page
            setTasks([res.data, ...tasks]);
            setTitle('');
            setDescription('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            // Remove it from the UI by filtering it out
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            setError('Could not delete task. Are you sure you own it?');
        }
    };

    const toggleTaskStatus = async (task) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${task._id}`, 
                { completed: !task.completed },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            
            // Replace the updated task in our state list
            setTasks(tasks.map(t => t._id === task._id ? res.data : t));
        } catch (err) {
            setError('Failed to update task status.');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading your dashboard...</div>;

    return (
        <div>
            <div className="dashboard-header">
                <div>
                    <h1>Hello, {user.username}! 👋</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        You are logged in as an <strong>{user.role}</strong>
                    </p>
                </div>
                <button onClick={logout} className="logout-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <LogOut size={18} /> Logout
                </button>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <form onSubmit={handleCreateTask} className="create-task-form">
                <h3>Create a New Task</h3>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <input 
                            type="text" 
                            placeholder="Task Title..." 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <input 
                            type="text" 
                            placeholder="Optional description" 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn" style={{ width: 'auto', alignSelf: 'flex-start' }}>
                        Add Task
                    </button>
                </div>
            </form>

            <h3 style={{ marginBottom: '1rem' }}>
                {user.role === 'admin' ? "All Users' Tasks (Admin View)" : "Your Tasks"}
            </h3>

            <div className="task-grid">
                {tasks.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No tasks here yet. Create one above!</p>
                ) : (
                    tasks.map(task => (
                        <div key={task._id} className="task-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 className="task-title" style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? 'var(--text-muted)' : 'inherit' }}>
                                        {task.title}
                                    </h4>
                                    <p className="task-desc">{task.description}</p>
                                    
                                    {/* Show who owns the task if we're an admin */}
                                    {user.role === 'admin' && task.user && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                                            Owner: {task.user.username || 'Unknown'}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="actions">
                                <button 
                                    className="btn btn-secondary" 
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderColor: task.completed ? 'var(--success)' : '' }}
                                    onClick={() => toggleTaskStatus(task)}
                                >
                                    {task.completed ? <CheckCircle size={18} color="var(--success)" /> : <Circle size={18} />}
                                    {task.completed ? 'Done' : 'Mark Done'}
                                </button>
                                <button 
                                    className="btn btn-danger" 
                                    style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                                    onClick={() => handleDeleteTask(task._id)}
                                >
                                    <Trash2 size={18} /> Delete
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
