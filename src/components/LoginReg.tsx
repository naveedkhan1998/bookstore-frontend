import React, { useState, useEffect } from "react";
import Login from "./Login";
import Registration from "./Registration";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import { getCurrentToken } from "../features/authSlice";
import { toast } from "react-toastify";
//import { GoogleLogin } from "react-google-login";

const LoginReg: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const token = useAppSelector(getCurrentToken);

  const responseGoogleSuccess = (response: any) => {
    console.log(response);
    // Handle the response, for example, send it to your server for authentication
  };

  // Function to handle failed Google login
  const responseGoogleFailure = (response: any) => {
    console.error(response);
    // Handle the error
  };

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
    <div className="container justify-center h-full pt-12 items-center">
      <div className=" w-full">
        {isLogin ? <Login /> : <Registration />}
        {/* <div className="p-8 bg-main-secondary dark:bg-dark-secondary shadow-md rounded-md flex flex-col items-center justify-center mt-4 w-full max-w-md mx-auto">
          <GoogleLogin
            clientId="534036280006-aop5b27af2nnk8tj0i6fr7v43mobm8gf.apps.googleusercontent.com"
            buttonText="Login with Google"
            onSuccess={responseGoogleSuccess}
            onFailure={responseGoogleFailure}
          />
        </div> */}
        <div className="p-8 bg-main-secondary dark:bg-dark-secondary shadow-md rounded-md flex flex-col items-center justify-center mt-4 w-full max-w-md mx-auto">
          {formMessage}
          <Button
            variant={"ghost"}
            className="text-blue-500 "
            onClick={toggleForm}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginReg;
