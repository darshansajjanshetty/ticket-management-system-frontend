import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');

    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      return null;
    }
  });

  const login = ({ token: userToken, user: userProfile }) => {
    setToken(userToken);
    setUser(userProfile);
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userProfile));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = useMemo(
    () => ({
      token,
      user,
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
