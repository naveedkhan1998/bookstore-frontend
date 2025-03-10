import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast: React.FC = () => {
  const toastOptions = {
    autoClose: 1100,
  };

  return <ToastContainer {...toastOptions} />;
};

export default Toast;
