import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as authService from '../services/authService';
import {
  readStoredSession,
  writeStoredSession,
  clearStoredSession,
} from '../services/authStorage';
import { showToast } from '../utils/toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const user = session?.user ?? null;

  const persistSession = useCallback((nextSession) => {
    writeStoredSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }, []);

  const login = useCallback(async (email, password) => {
    const nextSession = await authService.login(email, password);
    return persistSession(nextSession);
  }, [persistSession]);

  const register = useCallback(async (payload) => {
    const nextSession = await authService.register(payload);
    return persistSession(nextSession);
  }, [persistSession]);

  const logout = useCallback(() => {
    clearStoredSession();
    setSession(null);
  }, []);

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored?.accessToken) {
      return;
    }

    authService
      .getMe()
      .then((currentUser) => {
        persistSession({ ...stored, user: currentUser });
      })
      .catch(() => {
        logout();
      });
  }, [logout, persistSession]);

  useEffect(() => {
    const handleUnauthorized = () => {
      showToast('Session expired. Please sign in again.', 'error');
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
        register,
        logout,
        isAuthenticated: !!user && !!session?.accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
