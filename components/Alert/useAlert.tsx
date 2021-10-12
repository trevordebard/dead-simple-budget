import { useContext } from 'react';
import { AlertContext } from './AlertProvider';

function useAlert() {
  const { alert, addAlert, removeAlert } = useContext(AlertContext);
  return { alert, addAlert, removeAlert };
}

export { useAlert };
