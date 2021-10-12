import { createContext, useCallback, useState } from 'react';

export type AlertTypes = 'error' | 'success' | 'neutral';
interface Alert {
  message: string;
  type?: AlertTypes;
  duration?: number;
}

interface AlertContextProps {
  alert: Alert;
  addAlert(a: Alert): void;
  removeAlert(): void;
}

const initialContext: AlertContextProps = {
  alert: null,
  addAlert: (a: Alert) => {},
  removeAlert: () => {},
};

export const AlertContext = createContext(initialContext);

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState<Alert | null>(null);

  const removeAlert = () => setAlert(null);
  const addAlert = (a: Alert) => setAlert(a);

  const contextValue = {
    alert,
    addAlert: useCallback(a => addAlert(a), []),
    removeAlert: useCallback(() => removeAlert(), []),
  };

  return <AlertContext.Provider value={contextValue}>{children}</AlertContext.Provider>;
}
