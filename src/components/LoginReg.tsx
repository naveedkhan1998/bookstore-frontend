import React, { useState, useEffect } from "react";
import Login from "./Login";
import Registration from "./Registration";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";

const LoginReg: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const token = useAppSelector(getCurrentToken);

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const formMessage = isLogin ? "Need an account? " : "Already have an account? ";
  const buttonText = isLogin ? "Register here" : "Login here";

  return (
    <div className="flex w-[75dvw] h-[80dvh] m-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Left Side Section with Gradient */}
      <div className="items-center justify-center hidden w-1/3 md:flex bg-gradient-to-b from-purple-500 via-indigo-500 to-blue-500">
        {/* Add some text or illustration */}
        <div className="p-4 text-center text-white">
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="mt-2">Please login to access your account or sign up if you're new.</p>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="flex flex-col items-center justify-center w-full p-8 bg-gray-100 dark:bg-gray-900 md:w-2/3">
        <div className="w-full max-w-md">
          {isLogin ? <Login /> : <Registration />}
          <div className="flex flex-col items-center justify-center w-full p-8 mt-4 rounded-md shadow-md bg-main-secondary dark:bg-dark-secondary">
            {formMessage}
            <Button variant={"ghost"} className="text-blue-500 " onClick={toggleForm}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginReg;
