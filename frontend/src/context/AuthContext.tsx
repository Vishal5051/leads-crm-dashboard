import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: any) => Promise<void>;
  register: (payload: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authService.getMe();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          logout();
        }
      }
    } catch (error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const login = async (payload: any): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(payload);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.register(payload);
      if (response.success && response.data) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
