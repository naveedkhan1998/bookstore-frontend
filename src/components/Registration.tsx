// src/components/Registration.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  useRegisterUserMutation,
  useGetLoggedUserQuery,
  useLazySendEmailQuery,
} from "../services/userAuthService";
import { setCredentials, getCurrentToken } from "../features/authSlice";
import { getToken, storeToken } from "../services/LocalStorageService";
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

  const [registerUser, isSuccess] = useRegisterUserMutation();
  const [sendEmail, { isSuccess: EmailSent }] = useLazySendEmailQuery();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registerUser(formData);
    if (isSuccess) {
      if ("data" in res) {
        // 'data' is present, safe to access
        const userData: UserData = res.data;

        sendEmail({ access_token: userData.access });
        storeToken({ value: { access: userData.access } });
        dispatch(setCredentials({ access: userData.access }));
        toast.success("Registered");
        navigate("/");
      } else {
        // 'error' is present, handle the error
        toast.error(JSON.stringify(res.error));
      }
    }

    //alert('registered')
    // Handle registration logic
    //console.log("Form submitted:", res);
  };

  useEffect(() => {
    if (EmailSent) {
      toast.success("Email sent");
    }
  }, [EmailSent]);

  return (
    <div className="flex items-top justify-center bg-main-primary dark:bg-dark-primary dark:text-slate-400">
      <div className="bg-main-secondary dark:bg-dark-secondary p-8 shadow-md rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <FloatingLabel
              variant="standard"
              label="Given Name"
              id="given_name"
              type="given_name"
              value={formData.given_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <FloatingLabel
              variant="standard"
              label="Family Name"
              id="family_name"
              type="family_name"
              value={formData.family_name}
              onChange={handleChange}
              required
            />
          </div>
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
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
