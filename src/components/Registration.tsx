import React, { useState, useEffect } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Button from "./ui/button/Button";
import Input from "./ui/input/input.component";
import { useAppDispatch } from "../app/hooks";
import {
  useRegisterUserMutation,
  useLazySendEmailQuery,
} from "../services/userAuthService";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
import { toast } from "react-toastify";

const Registration: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  interface UserData {
    _id: string;
    access: string;
    email: string;
    family_name: string;
    given_name: string;
  }

  const [formData, setFormData] = useState({
    given_name: "",
    family_name: "",
    email: "",
    password: "",
  });

  const [registerUser] = useRegisterUserMutation();
  const [sendEmail, { isSuccess: EmailSent }] = useLazySendEmailQuery();
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await registerUser(formData).unwrap();
      const userData: UserData = res as UserData;

      await sendEmail({ access_token: userData.access }).unwrap();
      storeToken({ value: { access: userData.access } });
      dispatch(setCredentials({ access: userData.access }));
      toast.success("Registered successfully");
      navigate("/");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (EmailSent) {
      toast.success("Verification email sent");
    }
  }, [EmailSent]);

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-main-primary via-main-secondary to-main-tertiary dark:from-dark-primary dark:via-dark-secondary dark:to-dark-tertiary" />
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-gray-200 bg-main-secondary shadow-[0_45px_100px_-50px_rgba(34,32,30,0.5)] dark:border-gray-800 dark:bg-dark-secondary">
        <div className="absolute -top-28 right-24 h-60 w-60 rounded-full bg-secondary/15 blur-3xl" />
        <div className="absolute -bottom-16 left-16 h-52 w-52 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative z-10 grid gap-10 px-8 py-10 sm:px-10">
          <div className="space-y-4 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-secondary">
              Create Account
            </span>
            <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-50">
              Join the Bookstore community
            </h2>
            <p className="text-base text-gray-600 dark:text-gray-300">
              Personalise your reading experience, follow trusted curators, and
              keep every list in sync.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Given Name"
                id="given_name"
                type="text"
                value={formData.given_name}
                onChange={handleChange}
                required
                startIcon={<User className="h-5 w-5" />}
                placeholder="Jane"
              />
              <Input
                label="Family Name"
                id="family_name"
                type="text"
                value={formData.family_name}
                onChange={handleChange}
                required
                startIcon={<User className="h-5 w-5" />}
                placeholder="Doe"
              />
            </div>

            <Input
              label="Email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              startIcon={<Mail className="h-5 w-5" />}
              placeholder="you@example.com"
              helperText="We�ll send a verification link to this address"
            />

            <Input
              label="Password"
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              startIcon={<Lock className="h-5 w-5" />}
              placeholder="Minimum 8 characters"
              helperText="Use at least one number and special character"
            />

            <div className="rounded-2xl border border-gray-200 bg-main-primary/70 p-5 text-sm text-gray-600 dark:border-gray-700 dark:bg-dark-tertiary/70 dark:text-gray-200">
              <span className="font-semibold text-secondary dark:text-secondary-dark">
                You�ll be able to:
              </span>
              <ul className="mt-3 grid gap-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                  Build private and shared reading lists
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                  Sync your progress across devices
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-secondary"></span>
                  Receive personalised weekly recommendations
                </li>
              </ul>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?
              <Link
                to="/auth"
                className="ml-1 font-medium text-secondary hover:text-secondary-hover"
              >
                Back to sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Registration;
