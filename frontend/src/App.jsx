import { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import './index.css';

// Wrapper that redirects unauthenticated users to login
function ProtectedRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="loader">Loading...</div>;
    return user ? children : <Navigate to="/" replace />;
}

// Wrapper that redirects authenticated users away from login/register
function GuestRoute({ children }) {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <div className="loader">Loading...</div>;
    return user ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app-container">
                    <nav className="navbar">
                        <h2 className="navbar-brand">TaskManager</h2>
                    </nav>
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<GuestRoute><Login /></GuestRoute>} />
                            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
                            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                        </Routes>
                    </main>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
