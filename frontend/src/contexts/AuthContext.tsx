import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'student' | 'teacher' | 'club' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: Record<string, User & { password: string }> = {
  'student@campus.edu': {
    id: '1',
    name: 'Alex Johnson',
    email: 'student@campus.edu',
    role: 'student',
    password: 'password',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  'teacher@campus.edu': {
    id: '2',
    name: 'Dr. Sarah Miller',
    email: 'teacher@campus.edu',
    role: 'teacher',
    password: 'password',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  'club@campus.edu': {
    id: '3',
    name: 'Tech Club',
    email: 'club@campus.edu',
    role: 'club',
    password: 'password',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
  },
  'admin@campus.edu': {
    id: '4',
    name: 'Admin User',
    email: 'admin@campus.edu',
    role: 'admin',
    password: 'password',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('campus_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUser = mockUsers[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userWithoutPassword } = mockUser;
      setUser(userWithoutPassword);
      localStorage.setItem('campus_user', JSON.stringify(userWithoutPassword));
    } else {
      throw new Error('Invalid email or password');
    }
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (role === 'admin') {
      throw new Error('Admin accounts cannot be created through signup');
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    };
    
    setUser(newUser);
    localStorage.setItem('campus_user', JSON.stringify(newUser));
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('campus_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, isLoading }}>
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
