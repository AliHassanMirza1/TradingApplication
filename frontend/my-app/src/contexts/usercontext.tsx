import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8000');

interface UserType {
    id: string;
    username: string;
    cash: number;
    itemsOwned: number;
    tradesCreated: string[];
    offersMade: string[];
}

interface UserContextType {
    user: UserType | null;
    login: (userData: UserType) => void;
    logout: () => void;
    refreshUser: () => void;  // Added to allow manual refreshes
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [user, setUser] = useState<UserType | null>(() => {
        const savedUserData = localStorage.getItem('userData');
        return savedUserData ? JSON.parse(savedUserData) : null;
    });

    const login = (userData: UserType) => {
        localStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        socket.emit('user_logged_in', userData.id); // Notify server that user has logged in
    };

    const logout = () => {
        localStorage.removeItem('userData');
        setUser(null);
        socket.emit('user_logged_out'); // Notify server that user has logged out
    };

    const refreshUser = async () => {
        // Placeholder for fetching user data from the server
        const response = await fetch(`http://localhost:8000/user/${user?.id}`);
        const updatedUserData = await response.json();
        if (response.ok) {
            localStorage.setItem('userData', JSON.stringify(updatedUserData));
            setUser(updatedUserData);
        }
    };

    useEffect(() => {
        // Listen for trade updates
        socket.on('trade_updated', refreshUser);

        return () => {
            socket.off('trade_updated', refreshUser);
        };
    }, []);

    useEffect(() => {
        // Optionally sync state with local storage changes if needed elsewhere in app
        const handleStorageChange = () => {
            const savedUserData = localStorage.getItem('userData');
            setUser(savedUserData ? JSON.parse(savedUserData) : null);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, login, logout, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
