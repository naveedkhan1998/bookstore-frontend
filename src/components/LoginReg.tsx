// src/components/LoginReg.tsx
import React, { useState } from "react";
import Login from "./Login";
import Registration from "./Registration";
import Button from "./Button";
import Footer from "../layouts/Footer";

const LoginReg: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-1 flex flex-col bg-stone-400 ">
          <div className="p-8  rounded-md">
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? "Login" : "Registration"}
            </h2>
            {isLogin ? <Login /> : <Registration />}
            <div className="p-8 bg-zinc-400 shadow-md rounded-md flex flex-col items-center justify-center mt-4 w-full max-w-md mx-auto">
              {isLogin ? "Need an account?" : "Already have an account?"}
              <Button
                variant={"ghost"}
                className="text-blue-500 cursor-pointer ml-1"
                onClick={toggleForm}
              >
                {isLogin ? "Register here" : "Login here"}
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-slate-800 flex flex-col justify-center items-center">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default LoginReg;
