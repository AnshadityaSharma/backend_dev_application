import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// The AuthContext is here so we don't have to keep passing props down to tell components if we are logged in.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // When the app starts, check if we have a token stored from a previous visit
    useEffect(() => {
        const loggedInUserStr = localStorage.getItem('user');
        if (loggedInUserStr) {
            setUser(JSON.parse(loggedInUserStr));
        }
        setLoading(false);
    }, []);

    // Helper functions to handle logging in and out
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        // We'll set the default axios auth header so we don't have to do it on every request
        axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
