
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'seller';
  photo?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isManager: boolean;
  canEditVehicles: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
  canEditBHPHSettings: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'Sistema',
    email: 'admin@revenshop.com',
    phone: '+55 11 99999-9999',
    role: 'admin',
    photo: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '2',
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@revenshop.com',
    phone: '+55 11 88888-8888',
    role: 'seller',
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face'
  },
  {
    id: '3',
    firstName: 'Maria',
    lastName: 'Gerente',
    email: 'maria@revenshop.com',
    phone: '+55 11 77777-7777',
    role: 'manager',
    photo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication - in real app, this would call an API
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === '123456') {
      setUser(foundUser);
      localStorage.setItem('revenshop_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('revenshop_user');
  };

  // Check if user is stored in localStorage on app start
  React.useEffect(() => {
    const storedUser = localStorage.getItem('revenshop_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAdmin = user?.role === 'admin';
  const isManager = user?.role === 'manager';
  const canEditVehicles = isAdmin || isManager;
  const canManageUsers = isAdmin || isManager;
  const canAccessAdmin = isAdmin || isManager;
  const canEditBHPHSettings = isAdmin;

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        isAuthenticated: !!user, 
        isAdmin,
        isManager,
        canEditVehicles,
        canManageUsers,
        canAccessAdmin,
        canEditBHPHSettings
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
