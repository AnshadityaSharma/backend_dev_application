import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, LogOut, CheckCircle, Circle, AlertTriangle } from 'lucide-react';
import API_BASE from '../config/api';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Auth header for every API call
    const authHeaders = { headers: { Authorization: `Bearer ${user.token}` } };

    // Auto-clear messages after 3 seconds
    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => { setError(''); setSuccess(''); }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const url = user.role === 'admin'
                ? `${API_BASE}/tasks?all=true`
                : `${API_BASE}/tasks`;
            const { data } = await axios.get(url, authHeaders);
            setTasks(data.tasks);
        } catch (err) {
            setError('Could not load tasks.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const { data } = await axios.post(`${API_BASE}/tasks`,
                { title, description, priority },
                authHeaders
            );
            setTasks([data, ...tasks]);
            setTitle('');
            setDescription('');
            setPriority('medium');
            setSuccess('Task created!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create task.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE}/tasks/${id}`, authHeaders);
            setTasks(tasks.filter(t => t._id !== id));
            setSuccess('Task deleted.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete task.');
        }
    };

    const handleToggleStatus = async (task) => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        try {
            const { data } = await axios.put(`${API_BASE}/tasks/${task._id}`,
                { status: newStatus },
                authHeaders
            );
            setTasks(tasks.map(t => t._id === task._id ? data : t));
        } catch (err) {
            setError('Failed to update task.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return <div className="loader">Loading dashboard...</div>;

    return (
        <div>
            {/* Header */}
            <div className="dashboard-header">
                <div>
                    <h1>Welcome, {user.username}</h1>
                    <p className="text-muted">
                        Role: <span className="badge">{user.role}</span>
                    </p>
                </div>
                <button onClick={handleLogout} className="logout-btn">
                    <LogOut size={16} /> Logout
                </button>
            </div>

            {/* Feedback messages */}
            {error && <div className="msg msg-error"><AlertTriangle size={16} /> {error}</div>}
            {success && <div className="msg msg-success"><CheckCircle size={16} /> {success}</div>}

            {/* Create task form */}
            <form onSubmit={handleCreate} className="create-task-form">
                <h3>New Task</h3>
                <div className="form-row">
                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <select
                        className="select-input"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    <button type="submit" className="btn" style={{ minWidth: '120px' }}>Add</button>
                </div>
            </form>

            {/* Tasks list */}
            <h3 style={{ marginBottom: '1rem' }}>
                {user.role === 'admin' ? 'All Tasks (Admin)' : 'Your Tasks'}
                <span className="text-muted" style={{ fontSize: '0.9rem', marginLeft: '0.5rem' }}>
                    ({tasks.length})
                </span>
            </h3>

            {tasks.length === 0 ? (
                <p className="text-muted">No tasks yet. Create your first one above.</p>
            ) : (
                <div className="task-grid">
                    {tasks.map(task => (
                        <div key={task._id} className={`task-card ${task.status === 'completed' ? 'task-done' : ''}`}>
                            <div className="task-header">
                                <h4 className="task-title">{task.title}</h4>
                                <span className={`priority-badge priority-${task.priority}`}>
                                    {task.priority}
                                </span>
                            </div>

                            {task.description && <p className="task-desc">{task.description}</p>}

                            {user.role === 'admin' && task.user && (
                                <p className="task-owner">by {task.user.username || 'unknown'}</p>
                            )}

                            <div className="actions">
                                <button
                                    className={`btn btn-sm ${task.status === 'completed' ? 'btn-success' : 'btn-secondary'}`}
                                    onClick={() => handleToggleStatus(task)}
                                >
                                    {task.status === 'completed'
                                        ? <><CheckCircle size={14} /> Done</>
                                        : <><Circle size={14} /> Pending</>
                                    }
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(task._id)}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
