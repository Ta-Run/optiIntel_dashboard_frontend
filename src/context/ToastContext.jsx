import { createContext, useContext, useCallback } from 'react';
import { showToast } from '../utils/toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const addToast = useCallback((message, type = 'success') => {
    showToast(message, type);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
