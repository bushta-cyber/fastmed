import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User>, password: string) => Promise<void>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    // Check for saved user in localStorage (simulating persistence)
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
      } catch (error) {
        localStorage.removeItem('user');
        setAuthState({ ...initialState, loading: false });
      }
    } else {
      setAuthState({ ...initialState, loading: false });
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll use a mock login
      const user = mockUsers.find(u => u.email === email);
      
      if (user && password === 'password') { // In a real app, we'd verify hashed passwords
        localStorage.setItem('user', JSON.stringify(user));
        setAuthState({
          isAuthenticated: true,
          user,
          loading: false,
          error: null,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
  };

  const register = async (userData: Partial<User>, password: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      const emailExists = mockUsers.some(u => u.email === userData.email);
      
      if (emailExists) {
        throw new Error('Email already registered');
      }
      
      // In a real app, we would create a new user in the database
      // For demo purposes, we'll just set the user as logged in
      const newUser = {
        id: `user-${Date.now()}`,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'patient',
      } as User;
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        loading: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      logout, 
      register 
    }}>
      {children}
    </AuthContext.Provider>
  );
};