import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "./Button";
import { useLoginUserMutation } from "../services/userAuthService";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { setCredentials, getCurrentToken } from "../features/authSlice";
import { getToken, storeToken } from "../services/LocalStorageService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FloatingLabel } from "flowbite-react";

interface FormData {
  email: string;
  password: string;
}

interface Token {
  access: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loginUser, isSuccess] = useLoginUserMutation();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await loginUser(formData);
    if (isSuccess) {
      if ("data" in res) {
        const token: Token = res.data;
        storeToken({ value: { access: token.access } });
        dispatch(setCredentials({ access: token.access }));
        navigate("/");
        toast.success("Logged In");
      } else if ("error" in res) {
        toast.error(JSON.stringify(res.error));
      }
    }
  };

  return (
    <div className="flex items-top justify-center bg-main-primary dark:bg-dark-primary dark:text-slate-400 ">
      <div className="bg-main-secondary dark:bg-dark-secondary p-8 shadow-md rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <FloatingLabel
              variant="standard"
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <FloatingLabel
              variant="standard"
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-gray p-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
