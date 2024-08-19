import React, { useState, ChangeEvent, FormEvent } from "react";
import Button from "./Button";
import { useLoginUserMutation } from "../services/userAuthService";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
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
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const res = await loginUser(formData).unwrap();
      const token: Token = res as Token;
      storeToken({ value: { access: token.access } });
      dispatch(setCredentials({ access: token.access }));
      navigate("/");
      toast.success("Logged In");
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-top ">
      <div className="w-full max-w-2xl p-8 rounded-md shadow-md bg-main-secondary dark:bg-dark-secondary text-main-text dark:text-dark-text">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Email" id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <FloatingLabel variant="standard" label="Password" id="password" type="password" value={formData.password} onChange={handleChange} required />
          </div>
          <Button
            type="submit"
            className={`w-full p-2 rounded text-main-text dark:text-dark-text ${loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"} focus:outline-none`}
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
