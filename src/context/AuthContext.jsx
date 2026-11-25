import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('access_token')));

  useEffect(() => {
    if (!localStorage.getItem('access_token')) {
      setLoading(false);
      return;
    }
    authService.getProfile()
      .then(({ data }) => {
        setUser(data.data);
        localStorage.setItem('auth_user', JSON.stringify(data.data));
      })
      .catch(() => {
        setUser(null);
        localStorage.removeItem('auth_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await authService.login(credentials);
    localStorage.setItem('access_token', data.token);
    localStorage.setItem('auth_user', JSON.stringify(data.data.user));
    setUser(data.data.user);
    return data.data.user;
  };

  const register = (payload) => authService.register(payload);

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
