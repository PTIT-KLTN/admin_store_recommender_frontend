import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { login as apiLogin } from '../services/auth';
import { Admin } from '../models/admin';

interface AuthContextType {
  user: Admin | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Admin | null>(() => {
    const stored = localStorage.getItem('admin_user');
    return stored ? JSON.parse(stored) : null;
    });

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Sign in and store user + token
  const signIn = async (username: string, password: string) => {
    const { admin: a, access_token, refresh_token } = await apiLogin(username, password);
    const u: Admin = {
      id: a.id,
      username: a.username,
      fullname: a.fullname,
      role: a.role,
      is_enabled: a.is_enabled,
    };

    localStorage.setItem('admin_user', JSON.stringify(u));
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    setUser(u);
  };

  // Sign out and clear storage
  const signOut = () => {
    localStorage.removeItem('admin_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};