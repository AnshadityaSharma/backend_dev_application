import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Adding role so we can easily test admin features
    const [role, setRole] = useState('user');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            // Send the registration request to our backend
            const res = await axios.post('http://localhost:5000/api/auth/register', {
                username,
                password,
                role
            });
            // Automatically log them in after a successful registration
            login(res.data);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create an account.');
        }
    };

    return (
        <div className="auth-container">
            <div className="card">
                <h2>Create Account</h2>
                {error && <div className="error-msg">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Pick a cool username"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Make it strong!"
                            minLength="6"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Role (for testing purposes)</label>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem 1rem', 
                                borderRadius: '8px', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(15, 23, 42, 0.5)',
                                color: 'white',
                                fontSize: '1rem' 
                            }}
                        >
                            <option value="user">Regular User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <button type="submit" className="btn">Sign Up</button>
                </form>
                
                <div className="link-text">
                    Already have an account? <Link to="/">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
