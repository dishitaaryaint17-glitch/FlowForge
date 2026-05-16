import { createContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, token, login: setLogin, logout: clearAuth, isAuthenticated } = useAuthStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsReady(true);
        return;
      }

      if (user) {
        setIsReady(true);
        return;
      }

      try {
        const response = await authService.getProfile();
        if (response?.user) {
          setLogin({ user: response.user, token });
        }
      } catch {
        clearAuth();
      } finally {
        setIsReady(true);
      }
    };

    bootstrap();
  }, [token, user, setLogin, clearAuth]);

  const login = async (payload) => {
    const response = await authService.login(payload);
    const userData = response.user;
    const tokenData = response.token;
    setLogin({ user: userData, token: tokenData });
    return userData;
  };

  const signup = async (payload) => {
    const response = await authService.signup(payload);
    const userData = response.user;
    const tokenData = response.token;
    setLogin({ user: userData, token: tokenData });
    return userData;
  };

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      signup,
      logout: clearAuth,
      isAuthenticated: isAuthenticated(),
      isReady,
    }),
    [user, token, isReady]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
