import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { login as apiLogin } from '../services/auth';
import { Admin } from '../models/models';

interface AuthContextType {
  user: Admin | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Admin | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('admin_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  // Sign in and store user + token
  const signIn = async (email: string, password: string) => {
    const json = await apiLogin(email, password);
    const u: Admin = json.admin;

    localStorage.setItem('admin_user', JSON.stringify(u));
    localStorage.setItem('access_token', json.access_token);
    localStorage.setItem('refresh_token', json.refresh_token); 
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