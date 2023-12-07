import React from 'react';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toast: React.FC = () => {

  const toastOptions = {
    autoClose: 1000,
    position: toast.POSITION.BOTTOM_LEFT,
  };

  return <ToastContainer {...toastOptions} />;
};

export default Toast;
