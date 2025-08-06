import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/profile');
      setUser(res.data);
    } catch (error) {
      console.error('[PROFILE] Error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await api.post('/auth/login', data);
      await fetchUser();
    } catch (error) {
      console.error('[LOGIN] Error:', error);
      throw error;
    }
  };
  const register = async (data: { email: string; password: string }) => {
    await api.post('/auth/register', data);
    await fetchUser();
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
