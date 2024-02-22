import React from 'react';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast: React.FC = () => {

  const toastOptions = {
    autoClose: 1100,
    position: toast.POSITION.TOP_CENTER,
  };

  return <ToastContainer {...toastOptions} />;
};

export default Toast;
