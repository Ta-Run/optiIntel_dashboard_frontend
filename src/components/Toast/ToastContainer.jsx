import { ToastContainer as ReactToastContainer } from 'react-toastify';

export default function ToastContainer() {
  return (
    <ReactToastContainer
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}
