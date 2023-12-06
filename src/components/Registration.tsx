// src/components/Registration.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { useRegisterUserMutation,useGetLoggedUserQuery } from "../services/userAuthService";
import { setCredentials, getCurrentToken } from "../features/authSlice";
import { getToken, storeToken } from "../services/LocalStorageService";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await registerUser(formData);
    if (isSuccess) {
      if ("data" in res) {
        // 'data' is present, safe to access
        const userData: UserData = res.data;

        storeToken({ value: { access: userData.access } });
        dispatch(setCredentials({ access: userData.access }));
        navigate("/");
      } else {
        // 'error' is present, handle the error
        alert(JSON.stringify(res.error));
      }
    }

    //alert('registered')
    // Handle registration logic
    //console.log("Form submitted:", res);
  };

  return (
    <div className="flex items-top justify-center bg-stone-400">
      <div className="bg-zinc-400 p-8 shadow-md rounded-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="given_name" className="block text-gray-600">
              Given Name
            </label>
            <input
              type="text"
              id="given_name"
              name="given_name"
              value={formData.given_name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="family_name" className="block text-gray-600">
              Family Name
            </label>
            <input
              type="text"
              id="family_name"
              name="family_name"
              value={formData.family_name}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none"
          >
            Register
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
