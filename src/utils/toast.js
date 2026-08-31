import { toast } from 'react-toastify';

const handlers = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
};

export function showToast(message, type = 'success') {
  const notify = handlers[type] ?? toast.info;
  notify(message);
}
