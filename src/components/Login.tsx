import React, { useState, ChangeEvent, FormEvent } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLoginUserMutation } from "../services/userAuthService";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "./ui/input/input.component";
import Button from "./ui/button/Button";

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
    const { id, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
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
      toast.success("Welcome back!");
    } catch (error) {
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex items-center min-h-screen px-4 py-8 m-auto">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Welcome back</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            startIcon={<Mail className="h-5 w-5" />}
            placeholder="Enter your email"
            autoComplete="email"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            startIcon={<Lock className="h-5 w-5" />}
            placeholder="Enter your password"
            helperText="Password must be at least 8 characters long"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-300 text-accent-DEFAULT focus:ring-accent-DEFAULT"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Remember me
              </span>
            </label>

            <Link
              to="/forgot-password"
              className="text-sm text-accent-DEFAULT hover:text-accent-hover"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            New to BookStore?{" "}
            <Link
              to="/auth"
              className="text-accent-DEFAULT hover:text-accent-hover font-medium"
            >
              Create an account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
