import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAppDispatch } from "../app/hooks";
import {
  useRegisterUserMutation,
  useLazySendEmailQuery,
} from "../services/userAuthService";
import { setCredentials } from "../features/authSlice";
import { storeToken } from "../services/LocalStorageService";
import { toast } from "react-toastify";
import { FloatingLabel } from "flowbite-react";

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
    <div className="w-full">
      <h2 className="mb-6 text-3xl font-bold text-center ">Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="relative">
            <FloatingLabel
              variant="standard"
              label="Given Name"
              id="given_name"
              type="text"
              value={formData.given_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="relative">
            <FloatingLabel
              variant="standard"
              label="Family Name"
              id="family_name"
              type="text"
              value={formData.family_name}
              onChange={handleChange}
              required
            />
          </div>
        </div>
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
                className="w-5 h-5 mr-3 -ml-1 text-white animate-spin"
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
              Registering...
            </span>
          ) : (
            "Register"
          )}
        </Button>
      </form>
    </div>
  );
};

export default Registration;
