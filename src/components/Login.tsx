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
    <div className="flex justify-center items-top ">
      <div className="w-full max-w-2xl p-8 rounded-md shadow-md bg-main-secondary dark:bg-dark-secondary">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Password" id="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <Button type="submit" className="w-full p-2 bg-blue-500 rounded text-gray hover:bg-blue-600 focus:outline-none">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
