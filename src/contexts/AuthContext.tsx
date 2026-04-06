import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE_URL } from '@/config';

export type UserRole = 'user' | 'subscribed' | 'admin';

export interface User {
    id: string;
    name?: string;
    email: string;
    role: UserRole;
    subscriptionStatus?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const refreshUser = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                credentials: 'include',
            });

            if (response.ok) {
                const userData = await response.json();
                const updatedUser = {
                    id: userData._id || userData.id,
                    name: userData.name,
                    email: userData.email,
                    role: userData.role,
                    subscriptionStatus: userData.subscriptionStatus
                };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            } else {
                // Cookie invalid or expired
                setUser(null);
                localStorage.removeItem('user');
            }
        } catch (error) {
            console.error('Failed to refresh user', error);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const storedUser = localStorage.getItem('user');

            if (storedUser) {
                setUser(JSON.parse(storedUser));
                await refreshUser();
            } else {
                // Even without a stored user, they might have an active cookie from another tab
                await refreshUser();
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } catch (error) {
            console.error('Logout request failed', error);
        }

        setUser(null);
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshUser, isAuthenticated: !!user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
