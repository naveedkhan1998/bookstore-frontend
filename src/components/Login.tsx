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
    <div className="w-full">
      <h2 className="mb-6 text-3xl font-bold text-center ">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
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
        <div className="relative">
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
          className={`w-full p-3 rounded-full  font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-DEFAULT ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-accent-DEFAULT hover:bg-accent-hover"
          }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-5 h-5 mr-3 -ml-1 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Logging in...
            </span>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Login;
