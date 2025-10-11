import React, { useState, ChangeEvent, FormEvent } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginUserMutation } from "@/services/api/auth";
import { useAppDispatch } from "@/app/store/hooks";
import { setCredentials } from "@/features/auth/authSlice";
import { storeToken } from "@/services/storage/localStorage";
import Input from "@/shared/ui/input/input.component";
import Button from "@/shared/ui/button/Button";

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
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-main-primary via-main-secondary to-main-tertiary dark:from-dark-primary dark:via-dark-secondary dark:to-dark-tertiary" />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-main-secondary shadow-[0_40px_90px_-45px_rgba(34,32,30,0.5)] dark:border-gray-800 dark:bg-dark-secondary">
        <div className="absolute -top-24 left-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-20 right-16 h-48 w-48 rounded-full bg-secondary/15 blur-3xl" />

        <div className="relative z-10 grid gap-10 px-8 py-10 sm:px-10">
          <div className="space-y-3 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">
              Sign In
            </span>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-50">
              Welcome back
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Access your personalised recommendations, saved booklists, and
              order history.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
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

            <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <input
                  type="checkbox"
                  id="rememberMe"
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-secondary focus:ring-secondary/40"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-secondary hover:text-secondary-hover"
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

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              New to Bookstore?
              <Link
                to="/registration"
                className="ml-1 font-medium text-secondary hover:text-secondary-hover"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
