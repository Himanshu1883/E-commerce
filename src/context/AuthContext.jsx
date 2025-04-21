import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('user', JSON.stringify(currentUser));
        } else {
            localStorage.removeItem('user');
        }
    }, [currentUser]);

    // Simple signup function - in a real app, you'd connect to a backend
    const signup = async (email, password, name) => {
        setLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Check if user already exists (simulate check from database)
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = existingUsers.some(user => user.email === email);

            if (userExists) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = {
                id: Date.now().toString(),
                email,
                name,
                // In a real app, you would hash the password
                // This is just for demonstration
                password
            };

            // Save to "database" (localStorage in this case)
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            // Set current user (without password)
            const { password: _, ...userWithoutPassword } = newUser;
            setCurrentUser(userWithoutPassword);

            return userWithoutPassword;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        setError('');

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get users from "database"
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Set current user (without password)
            const { password: _, ...userWithoutPassword } = user;
            setCurrentUser(userWithoutPassword);

            return userWithoutPassword;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = () => {
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        error,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}