import { createContext, useMemo, useState } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;
const nextId = () => `toast-${Date.now()}-${idCounter += 1}`;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  };

  const toast = ({ title, description, variant = 'default' }) => {
    const id = nextId();
    setToasts((current) => [...current, { id, title, description, variant }]);
    window.setTimeout(() => dismiss(id), 3200);
    return id;
  };

  const value = useMemo(() => ({ toast, dismiss, toasts }), [toasts]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
