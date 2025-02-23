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

  const formMessage = isLogin
    ? "Need an account? "
    : "Already have an account? ";
  const buttonText = isLogin ? "Register here" : "Login here";

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-main-primary to-main-secondary dark:from-dark-primary dark:to-dark-secondary">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto my-8 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
        <div className="items-center justify-center hidden w-full md:w-1/2 md:flex bg-gradient-to-br from-accent-DEFAULT to-secondary-DEFAULT">
          <div className="p-8 text-center text-white">
            <h2 className="mb-4 text-4xl font-bold animate-fade-in-down">
              {isLogin ? "Welcome Back!" : "Join Us Today!"}
            </h2>
            <p className="mt-2 text-lg animate-fade-in-up">
              {isLogin
                ? "Please login to access your account."
                : "Sign up to start your journey with us."}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full p-8 transition-all duration-300 bg-white md:w-1/2 dark:bg-dark-secondary rounded-xl md:rounded-l-none">
          <div className="w-full max-w-md">
            {isLogin ? <Login /> : <Registration />}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formMessage}
              </p>
              <Button
                variant="ghost"
                className="transition-colors duration-300 text-accent-DEFAULT hover:text-accent-hover"
                onClick={toggleForm}
              >
                {buttonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginReg;
