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
    <div className="flex w-[75dvw] h-[80dvh] m-auto rounded-lg shadow-lg overflow-hidden">
      {/* Left Side Section with Redesigned Gradient */}
      <div
        className="items-center justify-center hidden w-2/3 md:flex"
        style={{
          background: "linear-gradient(60deg, #2C1810, #7D4F50, #D4A373, #F8F3E6, #E6DCC8)",
          backgroundSize: "300% 300%",
          animation: "gradient-animation 8s ease infinite",
        }}
      >
        {/* Add some text or illustration */}
        <div className="p-4 text-center text-main-text dark:text-dark-text">
          <h2 className="text-2xl font-bold">Welcome Back!</h2>
          <p className="mt-2">Please login to access your account or sign up if you're new.</p>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="flex flex-col items-center justify-center w-full md:p-8 bg-main-secondary/65 dark:bg-dark-secondary/65">
        <div className="w-full">
          {isLogin ? <Login /> : <Registration />}
          <div className="flex flex-col items-center justify-center w-full max-w-2xl p-8 m-auto mt-4 rounded-md shadow-md bg-main-secondary dark:bg-dark-secondary">
            {formMessage}
            <Button variant={"ghost"} className="text-blue-500" onClick={toggleForm}>
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginReg;
