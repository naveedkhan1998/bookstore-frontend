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
    <div className="container flex items-center min-h-screen px-4 py-8 m-auto">
      <div className="w-full max-w-md mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please fill in your information to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Given Name"
              id="given_name"
              type="text"
              value={formData.given_name}
              onChange={handleChange}
              required
              startIcon={<User className="h-5 w-5" />}
              placeholder="John"
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
            placeholder="john.doe@example.com"
            helperText="We'll send you a verification email"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            startIcon={<Lock className="h-5 w-5" />}
            placeholder="Create a strong password"
            helperText="Must be at least 8 characters with numbers and special characters"
          />

          <Button
            type="submit"
            variant="default"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/auth"
              className="text-accent-DEFAULT hover:text-accent-hover font-medium"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Registration;
