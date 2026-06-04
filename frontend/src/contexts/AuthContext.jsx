import { createContext, useContext, useMemo, useState } from 'react';
import { authApi } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sn24_user') || 'null'));

  const value = useMemo(() => ({
    user,
    async login(payload) {
      const data = await authApi.login(payload);
      localStorage.setItem('sn24_access', data.accessToken);
      localStorage.setItem('sn24_refresh', data.refreshToken);
      localStorage.setItem('sn24_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    },
    async register(payload) {
      const data = await authApi.register(payload);
      localStorage.setItem('sn24_access', data.accessToken);
      localStorage.setItem('sn24_refresh', data.refreshToken);
      localStorage.setItem('sn24_user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    },
    logout() {
      localStorage.removeItem('sn24_access');
      localStorage.removeItem('sn24_refresh');
      localStorage.removeItem('sn24_user');
      setUser(null);
    }
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
